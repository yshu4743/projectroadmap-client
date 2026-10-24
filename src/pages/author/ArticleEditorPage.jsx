import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Save, Send, Loader2, ArrowLeft, FileText } from 'lucide-react';
import { api, handleError } from '../../api/client';
import ArticleEditor from '../../components/editor/ArticleEditor';
import StatusBadge from '../../components/article/StatusBadge';
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../../lib/constants';

const EMPTY = { title: '', excerpt: '', category: 'poem', language: 'malayalam', content: '', status: 'draft' };

export default function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!id) {
      setLoaded(true);
      return;
    }
    api.articles
      .one(id)
      .then(({ data }) => {
        const a = data.article;
        setForm({
          title: a.title,
          excerpt: a.excerpt || '',
          category: a.category,
          language: a.language,
          content: a.content,
          status: a.status,
        });
      })
      .catch((e) => setError(handleError(e).message))
      .finally(() => setLoaded(true));
  }, [id]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (status) => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, status };
      let result;
      if (id) {
        result = await api.articles.update(id, payload);
      } else {
        result = await api.articles.create(payload);
      }
      setNotice(status === 'pending' ? 'Submitted for review. നിങ്ങളുടെ കഥ എഡിറ്ററുടെ മേശയിൽ എത്തി ✓' : 'Draft saved.');
      setTimeout(() => setNotice(''), 3500);
      if (!id) navigate(`/author/edit/${result.data.article._id}`, { replace: true });
    } catch (e) {
      setError(handleError(e).message);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-rosewood" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10" ref={scrollRef}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/author" className="btn-ghost -ml-3">
            <ArrowLeft className="h-4 w-4" /> Desk
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold">
              {id ? 'Edit piece' : 'New piece'}
            </h1>
            <p className="text-sm text-fadedink">
              Annotate in Malayalam or English — the editor keeps the same hands on the paper.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {id && form.status && <StatusBadge status={form.status} />}
          <button onClick={() => save('draft')} className="btn-secondary !py-2" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button onClick={() => save('pending')} className="btn-primary !py-2" disabled={saving}>
            <Send className="h-4 w-4" /> Submit for review
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron">{error}</p>
      )}
      {notice && (
        <p className="mb-4 rounded-lg border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-moss">{notice}</p>
      )}

      <div className="space-y-5">
        <div>
          <label className="label">Title / തലക്കെട്ട്</label>
          <input
            className="input-base font-serif text-lg"
            placeholder="Give your piece a title…"
            value={form.title}
            onChange={(e) => set('title')(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Category</label>
            <select className="input-base" value={form.category} onChange={(e) => set('category')(e.target.value)}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Language</label>
            <select className="input-base" value={form.language} onChange={(e) => set('language')(e.target.value)}>
              {Object.entries(LANGUAGE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Excerpt (one line)</label>
            <input
              className="input-base"
              maxLength={300}
              placeholder="A teaser for the edition grid…"
              value={form.excerpt}
              onChange={(e) => set('excerpt')(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <FileText className="h-4 w-4" /> Body
          </label>
          <ArticleEditor language={form.language} value={form.content} onChange={set('content')} />
        </div>
      </div>
    </div>
  );
}