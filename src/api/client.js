import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const onAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
      if (!onAuthPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    register: (body) => client.post('/auth/register', body),
    login: (body) => client.post('/auth/login', body),
    me: () => client.get('/auth/me'),
  },
  articles: {
    list: (params) => client.get('/articles', { params }),
    one: (id) => client.get(`/articles/${id}`),
    create: (body) => client.post('/articles', body),
    update: (id, body) => client.patch(`/articles/${id}`, body),
    status: (id, body) => client.patch(`/articles/${id}/status`, body),
    mine: () => client.get('/articles/my-submissions'),
    pending: () => client.get('/articles/pending'),
    remove: (id) => client.delete(`/articles/${id}`),
  },
  issues: {
    current: () => client.get('/issues/current'),
    archive: () => client.get('/issues/archive'),
    one: (id) => client.get(`/issues/${id}`),
    editable: () => client.get('/issues/editable'),
    create: (body) => client.post('/issues', body),
    update: (id, body) => client.patch(`/issues/${id}`, body),
    publish: (id, isPublished) => client.patch(`/issues/${id}/publish`, { isPublished }),
    remove: (id) => client.delete(`/issues/${id}`),
  },
};

export function handleError(error) {
  const message = error?.response?.data?.message || error.message || 'Something went wrong';
  return { message };
}