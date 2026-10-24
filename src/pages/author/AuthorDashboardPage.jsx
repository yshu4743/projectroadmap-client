import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, Clock, CheckCircle2, XCircle, Send, PenLine } from 'lucide-react';
import { api, handleError } from '../../api/client';
import StatusBadge from '../../components/article/StatusBadge';
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../../lib/constants';

const STATUS_ORDER = ['draft', 'pending', 'approved', 'published', 'rejected'];

export default function AuthorDashboardPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => {
    setLoading(true);
    api.articles
      .mine()
      .then(({ data }) => setArticles(data.articles))
      .catch((e) => setError(handleError(e).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submitForReview = async (id) => {
    try {
      await api.articles.update(id, { status: 'pending' });
      setNotice('Submitted for editorial review. കാത്തിരിക്കാം ✍');
      load();
      setTimeout(() => setNotice(''), 4000);
    } catch (e) {
      setError(handleError(e).message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this draft permanently?')) return;
    try {
      await api.articles.remove(id);
      load();
    } catch (e) {
      setError(handleError(e).message);
    }
  };

  const summary = (s) => articles.filter((a) => a.status === s).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Author Desk</h1>
          <p className="mt-1 text-sm text-fadedink">
            Your submissions to the weekly magazine, in order of their journey.
          </p>
        </div>
        <Link to="/author/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New piece
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="card p-3 text-center">
            <p className="text-2xl font-bold text-ink">{summary(s)}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-fadedink">{s}</p>
          </div>
        ))}
      </div>

      {notice && (
        <p className="mb-4 rounded-lg border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-moss">{notice}</p>
      )}
      {error && !loading && (
        <p className="mb-4 rounded-lg border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-rosewood" />
        </div>
      ) : articles.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-serif text-xl text-fadedink">Your desk is empty.</p>
          <p className="mt-1 text-sm text-fadedink/70">Draft your first piece for the next edition.</p>
          <Link to="/author/new" className="btn-secondary mt-5">
            <PenLine className="h-4 w-4" /> Start writing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a._id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={a.status} />
                  <span className="text-xs text-fadedink">{CATEGORY_LABELS[a.category]}</span>
                  <span className="text-xs text-fadedink">· {LANGUAGE_LABELS[a.language]}</span>
                  {a.rejectionReason && a.status === 'rejected' && (
                    <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
                      <XCircle className="h-3 w-3" /> {a.rejectionReason}
                    </span>
                  )}
                </div>
                <h2 className="font-serif mt-2 text-lg font-semibold leading-snug">{a.title}</h2>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-fadedink">
                  <Clock className="h-3 w-3" /> Updated {new Date(a.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {a.status === 'draft' && (
                  <button onClick={() => submitForReview(a._id)} className="btn-secondary !px-3 !py-1.5 text-xs">
                    <Send className="h-3.5 w-3.5" /> Submit
                  </button>
                )}
                {(a.status === 'draft' || a.status === 'rejected') && (
                  <Link to={`/author/edit/${a._id}`} className="btn-ghost !p-2" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                )}
                {a.status === 'pending' && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Clock className="h-4 w-4" /> With the editor
                  </span>
                )}
                {a.status === 'published' && (
                  <a href={`/articles/${a._id}`} className="flex items-center gap-1 text-xs font-semibold text-moss hover:underline">
                    <CheckCircle2 className="h-4 w-4" /> In issue
                  </a>
                )}
                {a.status !== 'published' && a.status !== 'pending' && (
                  <button onClick={() => remove(a._id)} className="btn-ghost !p-2 text-red-700" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}