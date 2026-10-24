import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { handleError } from '../../api/client';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'editor' ? '/editor' : user.role === 'author' ? '/author' : '/');
    } catch (err) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <div className="mb-6 text-center">
        <Feather className="mx-auto h-8 w-8 text-rosewood" />
        <h1 className="font-serif mt-3 text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-fadedink">Sign in to the library reading circle.</p>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && (
          <p className="rounded-md border border-saffron/30 bg-saffron/10 px-3 py-2 text-sm text-saffron">{error}</p>
        )}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input-base"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input-base"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button className="btn-primary w-full justify-center" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-fadedink">
        New to the reading circle?{' '}
        <Link to="/register" className="font-semibold text-rosewood hover:underline">
          Create an account
        </Link>
      </p>

      <div className="card mt-6 bg-white/40 p-4 text-center text-xs text-fadedink">
        Demo accounts (seeded): editor@library.test · lakshmi@library.test · reader@library.test — password: <b>password1</b>
      </div>
    </div>
  );
}