import { useEffect, useMemo, useState } from 'react';
import {
  Check, X, Loader2, Plus, Send, Calendar, Globe, Tag, PencilLine, BookOpen, RotateCcw,
} from 'lucide-react';
import { api, handleError } from '../../api/client';
import StatusBadge from '../../components/article/StatusBadge';
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../../lib/constants';

const REVIEW_COLUMNS = [
  { key: 'pending', label: 'Pending review', tint: 'border-amber-300 bg-amber-50/60' },
  { key: 'approved', label: 'Approved', tint: 'border-emerald-300 bg-emerald-50/60' },
  { key: 'published', label: 'Published', tint: 'border-ink/15 bg-white/60' },
  { key: 'rejected', label: 'Rejected', tint: 'border-red-200 bg-red-50/40' },
];

export default function EditorPortalPage() {
  const [tab, setTab] = useState('review');
  const [articles, setArticles] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [rejecting, setRejecting] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  const [issueForm, setIssueForm] = useState({ issueNumber: '', title: '', releaseDate: '' });
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [adding, setAdding] = useState('');

  const loadReview = () => {
    setLoading1(true);
    api.articles
      .pending()
      .then(({ data }) => setArticles(data.articles))
      .catch((e) => setError(handleError(e).message))
      .finally(() => setLoading1(false));
  };

  const loadIssues = () => {
    setLoading2(true);
    api.issues
      .editable()
      .then(({ data }) => {
        setIssues(data.issues);
        const published = data.issues.find((i) => i.isPublished);
        const latest = data.issues[0];
        setSelectedIssueId((prev) => {
          if (prev && data.issues.some((i) => i._id === prev)) return prev;
          return (published || latest)?._id || '';
        });
      })
      .catch((e) => setError(handleError(e).message))
      .finally(() => setLoading2(false));
  };

  useEffect(() => {
    loadReview();
    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const moveStatus = async (id, status, rejectionReason) => {
    try {
      await api.articles.status(id, { status, rejectionReason });
      flash(status === 'approved' ? 'Approved ✓' : status === 'rejected' ? 'Rejected with note' : 'Status updated');
      loadReview();
      loadIssues();
      setRejecting(null);
      setRejectNote('');
    } catch (e) {
      setError(handleError(e).message);
    }
  };

  const createIssue = async (e) => {
    e.preventDefault();
    try {
      const issue = await api.issues.create({
        issueNumber: Number(issueForm.issueNumber),
        title: issueForm.title,
        releaseDate: issueForm.releaseDate,
      });
      setIssueForm({ issueNumber: '', title: '', releaseDate: '' });
      setSelectedIssueId(issue.data.issue._id);
      loadIssues();
      flash('Edition created — add approved pieces below.');
    } catch (err) {
      setError(handleError(err).message);
    }
  };

  const selectedIssue = issues.find((i) => i._id === selectedIssueId);
  const inIssue = (a) => selectedIssue?.articles?.some((x) => x._id === a._id);

  const toggleArticle = async (articleId) => {
    if (!selectedIssue) return;
    const ids = selectedIssue.articles.map((a) => a._id);
    const next = ids.some((x) => x === articleId)
      ? ids.filter((x) => x !== articleId)
      : [...ids, articleId];
    try {
      await api.issues.update(selectedIssueId, { articles: next });
      loadIssues();
    } catch (e) {
      setError(handleError(e).message);
    }
  };

  const togglePublish = async () => {
    if (!selectedIssue) return;
    try {
      await api.issues.publish(selectedIssueId, !selectedIssue.isPublished);
      flash(
        selectedIssue.isPublished
          ? `Issue #${selectedIssue.issueNumber} unpublished.`
          : `Issue #${selectedIssue.issueNumber} published 🎉`
      );
      loadReview();
      loadIssues();
    } catch (e) {
      setError(handleError(e).message);
    }
  };

  const approvedPool = useMemo(() => articles.filter((a) => a.status === 'approved'), [articles]);

  const grouped = useMemo(() => {
    const g = { pending: [], approved: [], published: [], rejected: [] };
    articles.forEach((a) => {
      if (g[a.status]) g[a.status].push(a);
    });
    return g;
  }, [articles]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Editorial Desk</h1>
          <p className="mt-1 text-sm text-fadedink">Review submissions and shape the weekly edition.</p>
        </div>
        <div className="flex rounded-full bg-fadedink/10 p-1">
          <button
            onClick={() => setTab('review')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === 'review' ? 'bg-white shadow-sm' : 'text-fadedink'}`}
          >
            Review board
          </button>
          <button
            onClick={() => setTab('issue')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${tab === 'issue' ? 'bg-white shadow-sm' : 'text-fadedink'}`}
          >
            <BookOpen className="h-4 w-4" /> Issue publisher
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron">{error}</p>
      )}
      {notice && (
        <p className="mb-4 rounded-lg border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-moss">{notice}</p>
      )}

      {tab === 'review' && (
        <div className="grid gap-5 lg:grid-cols-4">
          {REVIEW_COLUMNS.map((col) => (
            <section key={col.key} className={`rounded-xl border p-3 ${col.tint}`}>
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink">{col.label}</h2>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold">{grouped[col.key].length}</span>
              </header>

              {loading1 && (
                <div className="py-6 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </div>
              )}

              <div className="space-y-3">
                {!loading1 &&
                  grouped[col.key].map((a) => (
                    <div key={a._id} className="rounded-lg border border-white bg-white/90 p-3 shadow-sm">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase text-fadedink">
                        <span className="flex items-center gap-0.5 text-saffron">
                          <Tag className="h-3 w-3" /> {CATEGORY_LABELS[a.category]}
                        </span>
                        <span className="flex items-center gap-0.5 text-brass">
                          <Globe className="h-3 w-3" /> {LANGUAGE_LABELS[a.language]}
                        </span>
                      </div>
                      <p className="font-serif text-sm font-semibold leading-snug">{a.title}</p>
                      <p className="mt-0.5 text-xs text-fadedink">by {a.author?.name}</p>
                      {a.rejectionReason && a.status === 'rejected' && (
                        <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-xs text-red-700">
                          “{a.rejectionReason}”
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1">
                        {col.key === 'pending' && (
                          <>
                            <button
                              onClick={() => moveStatus(a._id, 'approved')}
                              className="flex-1 rounded-md bg-emerald-600 px-2 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                            >
                              <Check className="mr-1 inline h-3.5 w-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => setRejecting(a)}
                              className="flex-1 rounded-md bg-red-100 px-2 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-200"
                            >
                              <X className="mr-1 inline h-3.5 w-3.5" /> Reject
                            </button>
                          </>
                        )}
                        {col.key === 'approved' && (
                          <button
                            onClick={() => setAdding(a)}
                            className={`w-full rounded-md px-2 py-1.5 text-xs font-bold transition ${
                              inIssue(a) ? 'bg-ink text-paper' : 'bg-moss text-white hover:bg-moss/80'
                            }`}
                          >
                            {inIssue(a) ? 'In edition ✓' : 'Add to edition'}
                          </button>
                        )}
                        {(col.key === 'published' || col.key === 'rejected') && (
                          <button
                            onClick={() => moveStatus(a._id, 'pending')}
                            className="flex items-center gap-1 rounded-md bg-fadedink/10 px-2 py-1 text-xs font-semibold text-fadedink transition hover:bg-fadedink/20"
                          >
                            <RotateCcw className="h-3 w-3" /> Revert
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                {!loading1 && grouped[col.key].length === 0 && (
                  <p className="px-1 py-4 text-center text-xs text-fadedink/60">Empty shelf</p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {tab === 'issue' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-1">
            <form onSubmit={createIssue} className="card space-y-3 p-5">
              <h2 className="font-serif text-lg font-semibold">Create a new edition</h2>
              <div>
                <label className="label">Issue number</label>
                <input
                  type="number"
                  className="input-base"
                  value={issueForm.issueNumber}
                  onChange={(e) => setIssueForm({ ...issueForm, issueNumber: e.target.value })}
                  placeholder="13"
                  required
                />
              </div>
              <div>
                <label className="label">Title</label>
                <input
                  className="input-base"
                  value={issueForm.title}
                  onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                  placeholder="October Week 2 — …"
                  required
                />
              </div>
              <div>
                <label className="label">Release date</label>
                <input
                  type="date"
                  className="input-base"
                  value={issueForm.releaseDate}
                  onChange={(e) => setIssueForm({ ...issueForm, releaseDate: e.target.value })}
                  required
                />
              </div>
              <button className="btn-primary w-full justify-center">
                <Plus className="h-4 w-4" /> Create edition
              </button>
            </form>

            <div className="card p-5">
              <h2 className="sidebar-heading">Editions</h2>
              {loading2 ? (
                <Loader2 className="h-5 w-5 animate-spin text-fadedink" />
              ) : issues.length === 0 ? (
                <p className="text-sm text-fadedink/60">No editions yet.</p>
              ) : (
                <div className="space-y-2">
                  {issues.map((i) => (
                    <button
                      key={i._id}
                      onClick={() => setSelectedIssueId(i._id)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                        selectedIssueId === i._id
                          ? 'border-ink bg-ink text-paper'
                          : 'border-fadedink/15 bg-white/60 hover:border-ink/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-bold">Issue #{i.issueNumber}</span>
                        <StatusBadge status={i.isPublished ? 'published' : 'draft'} />
                      </div>
                      <p className={`mt-0.5 text-xs ${selectedIssueId === i._id ? 'text-paper/70' : 'text-fadedink'}`}>
                        {i.title}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] opacity-70">
                        <Calendar className="h-3 w-3" />
                        {new Date(i.releaseDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedIssue ? (
              <div className="card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b editorial-rule pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold">Issue #{selectedIssue.issueNumber}</h2>
                    <p className="text-sm text-fadedink">{selectedIssue.title}</p>
                  </div>
                  <button
                    onClick={togglePublish}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      selectedIssue.isPublished
                        ? 'bg-fadedink/15 text-ink hover:bg-fadedink/25'
                        : 'bg-rosewood text-white hover:bg-ink'
                    }`}
                  >
                    <Send className="mr-1.5 inline h-4 w-4" />
                    {selectedIssue.isPublished ? 'Unpublish edition' : 'Publish edition'}
                  </button>
                </div>

                <h3 className="sidebar-heading mb-2">
                  In this edition ({selectedIssue.articles.length})
                </h3>
                <div className="space-y-2">
                  {selectedIssue.articles.length === 0 && (
                    <p className="text-sm text-fadedink/60">
                      Empty edition — pull pieces from the approved shelf below.
                    </p>
                  )}
                  {selectedIssue.articles.map((a) => (
                    <div
                      key={a._id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-serif text-sm font-semibold">{a.title}</p>
                        <p className="text-xs text-fadedink">by {a.author?.name}</p>
                      </div>
                      <button
                        onClick={() => toggleArticle(a._id)}
                        className="rounded-md px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <h3 className="sidebar-heading mb-2 mt-6">Approved shelf — add to this edition</h3>
                <div className="space-y-2">
                  {loading1 && <Loader2 className="h-5 w-5 animate-spin text-fadedink" />}
                  {!loading1 && approvedPool.length === 0 && (
                    <p className="text-sm text-fadedink/60">
                      Nothing approved yet. Approve pieces from the review board first.
                    </p>
                  )}
                  {!loading1 &&
                    approvedPool
                      .filter((a) => !inIssue(a))
                      .map((a) => (
                        <div
                          key={a._id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-fadedink/15 bg-white/70 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-serif text-sm font-semibold">{a.title}</p>
                              <span className="flex items-center gap-1 text-[11px] text-fadedink">
                                <Globe className="h-3 w-3" /> {LANGUAGE_LABELS[a.language]}
                              </span>
                            </div>
                            <p className="text-xs text-fadedink">
                              by {a.author?.name} · {CATEGORY_LABELS[a.category]}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleArticle(a._id)}
                            className="rounded-md bg-moss px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-moss/80"
                          >
                            <Plus className="mr-1 inline h-3.5 w-3.5" /> Add
                          </button>
                        </div>
                      ))}
                </div>
              </div>
            ) : (
              <div className="card p-10 text-center text-fadedink">
                <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-50" />
                <p className="font-serif text-lg">Select or create an edition to begin publishing.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {rejecting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setRejecting(null)}
        >
          <div className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold">
              Reject “{rejecting.title.slice(0, 40)}{rejecting.title.length > 40 ? '…' : ''}”
            </h3>
            <p className="mt-1 text-sm text-fadedink">Feedback reaches the author and shows on their dashboard.</p>
            <textarea
              rows={3}
              className="input-base malayalam mt-4 resize-none"
              placeholder="Why not this week? Be kind, be specific…"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setRejecting(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={!rejectNote.trim()}
                onClick={() => moveStatus(rejecting._id, 'rejected', rejectNote.trim())}
              >
                <PencilLine className="h-4 w-4" /> Reject with note
              </button>
            </div>
          </div>
        </div>
      )}

      {adding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setAdding(null)}
        >
          <div className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold">Add to edition</h3>
            <p className="mt-1 text-sm text-fadedink">
              Choose an edition for “{adding.title.slice(0, 40)}{adding.title.length > 40 ? '…' : ''}”.
            </p>
            <div className="mt-4 space-y-2">
              {issues.map((i) => (
                <button
                  key={i._id}
                  onClick={async () => {
                    const ids = i.articles.map((a) => a._id);
                    const next = ids.some((x) => x === adding._id)
                      ? ids.filter((x) => x !== adding._id)
                      : [...ids, adding._id];
                    await api.issues.update(i._id, { articles: next });
                    setSelectedIssueId(i._id);
                    setAdding(null);
                    loadIssues();
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-fadedink/15 px-3 py-2.5 text-left transition hover:border-moss/60 hover:bg-moss/5"
                >
                  <span>
                    <span className="font-serif font-bold">Issue #{i.issueNumber}</span>
                    <span className="block text-xs text-fadedink">{i.title}</span>
                  </span>
                  {i.articles.some((a) => a._id === adding._id) && (
                    <span className="text-xs font-bold text-moss">In edition ✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}