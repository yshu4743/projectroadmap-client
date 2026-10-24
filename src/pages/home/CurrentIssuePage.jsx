import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Loader2 } from 'lucide-react';
import { api, handleError } from '../../api/client';
import ArticleCard from '../../components/article/ArticleCard';
import Reveal from '../../components/common/Reveal';
import Ticker from '../../components/common/Ticker';
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../../lib/constants';

function DateLine({ issue }) {
  return (
    <span className="inline-flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink">
      <span className="eyebrow">Weekly</span>
      <span className="opacity-40">
        {issue
          ? new Date(issue.releaseDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Reading Room'}
      </span>
      {issue && (
        <>
          <span className="h-4 w-px bg-ink/30" />
          <span className="opacity-60">Issue&nbsp;{issue.issueNumber}</span>
        </>
      )}
    </span>
  );
}

function Hero({ issue }) {
  const pieceCount = issue?.articles?.length || 0;
  const languages = new Set((issue?.articles || []).map((a) => a.language)).size;

  return (
    <section className="bg-grid relative flex min-h-[78vh] flex-col justify-end overflow-hidden border-b-4 border-ink bg-paper">
      <div className="relative z-10 w-full max-w-[1440px] px-4 pb-24 pt-16 sm:px-8">
        <Reveal>
          <p className="eyebrow mb-6">Est. 2026 — Reading Circle</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="hero-title">
            <span className="block">Words Built</span>
            <span className="block pl-4 sm:pl-16">
              to Endure<span className="dot">.</span>
            </span>
          </h1>
        </Reveal>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={140}>
            <p className="max-w-md text-[0.82rem] leading-relaxed opacity-55">
              A weekly digital magazine published by the local library. Poetry, short
              stories, essays and reviews — in Malayalam and English, from the writers
              at our own reading table.
            </p>
          </Reveal>
          <Reveal delay={200} className="flex gap-8 text-[0.8rem] sm:gap-10">
            <div>
              <div className="font-display text-4xl sm:text-5xl">
                #{issue?.issueNumber ?? '—'}
              </div>
              <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] opacity-40">
                Issue
              </div>
            </div>
            <div>
              <div className="font-display text-4xl sm:text-5xl">
                {pieceCount}
                <span className="text-rosewood">+</span>
              </div>
              <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] opacity-40">
                Pieces
              </div>
            </div>
            <div>
              <div className="font-display text-4xl sm:text-5xl">
                {languages || 2}
                <span className="text-rosewood">×</span>
              </div>
              <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] opacity-40">
                Languages
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <DateLine issue={issue} />
      <div className="absolute inset-y-0 right-4 hidden items-end pb-16 lg:flex">
        <span className="hero-scroll-cue flex flex-col items-center">Scroll</span>
      </div>
    </section>
  );
}

function FilterBar({ onFilter }) {
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    onFilter({ category, language, q });
  }, [category, language, q, onFilter]);

  return (
    <div className="flex flex-col gap-3 border-2 border-ink bg-paper p-4 shadow-[5px_5px_0_0_#0C0C0A] sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40" />
        <input
          className="input-base pl-9"
          placeholder="Search by title or author…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 opacity-50" />
        <select className="input-base w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="input-base w-auto" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">All languages</option>
          {Object.entries(LANGUAGE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FeaturedLayout({ articles, issue }) {
  const featured = articles[0];
  const poems = articles.filter((a) => a.category === 'poem').slice(0, 5);
  const rest = articles.filter((a) => a.category !== 'poem' && a !== featured);
  const reviews = articles.filter((a) => a.category === 'book-review').slice(0, 4);

  if (!featured) {
    return (
      <div className="border-2 border-ink bg-paper p-12 text-center shadow-[6px_6px_0_0_#0C0C0A]">
        <p className="font-display text-2xl uppercase opacity-60">No pieces yet in this edition.</p>
        <p className="mt-2 text-sm opacity-50">Words are being gathered at the reading table.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="relative overflow-hidden border-4 border-ink bg-ink text-paper shadow-[10px_10px_0_0_#FF3E00]">
          <div className="p-8 sm:p-10">
            <p className="tag tag--accent mb-6">
              Featured · {CATEGORY_LABELS[featured.category]}
            </p>
            <h2 className="font-display max-w-2xl text-3xl uppercase leading-tight sm:text-5xl">
              {featured.title}
            </h2>
            {featured.excerpt && <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/70">{featured.excerpt}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-rosewood">
                {featured.author?.name}
              </span>
              <Link
                to={`/articles/${featured._id}`}
                className="btn-primary !px-4 !py-2"
              >
                Read now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {issue && (
          <div className="flex items-center gap-3 border-y-4 border-ink py-3">
            <span className="eyebrow">In this edition</span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] opacity-40">
              #{issue.issueNumber} · {issue.title}
            </span>
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2">
          {rest.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      </div>

      <aside className="space-y-8">
        {poems.length > 0 && (
          <section className="border-4 border-ink bg-paper p-6 shadow-[8px_8px_0_0_#0C0C0A]">
            <div className="mb-5 flex items-center justify-between gap-2">
              <h3 className="sidebar-heading !mb-0">
                <span className="malayalam malayalam-bold text-rosewood">കവിതകൾ</span> · Poems
              </h3>
              <span className="tag tag--filled">{poems.length}</span>
            </div>
            <div className="divide-y-2 divide-ink">
              {poems.map((p) => (
                <div key={p._id} className="py-3 first:pt-0 last:pb-0">
                  <Link to={`/articles/${p._id}`} className="group">
                    <p className="font-display text-base font-bold uppercase leading-snug transition group-hover:text-rosewood">
                      {p.title}
                    </p>
                    <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] opacity-50">
                      {p.author?.name}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <section className="border-4 border-ink bg-ink p-6 text-paper shadow-[8px_8px_0_0_#FF3E00]">
            <div className="mb-5 flex items-center justify-between gap-2">
              <h3 className="sidebar-heading !mb-0 !text-paper/50">Book Reviews</h3>
              <span className="tag tag--accent">{reviews.length}</span>
            </div>
            <div className="divide-y-2 divide-white/15">
              {reviews.map((r) => (
                <div key={r._id} className="py-3 first:pt-0 last:pb-0">
                  <Link to={`/articles/${r._id}`} className="group">
                    <p className="font-display text-sm font-bold uppercase leading-snug transition group-hover:text-rosewood">
                      “{r.title}”
                    </p>
                    <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper/40">
                      Reviewed by {r.author?.name}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {issue && (
          <Link to="/archive" className="group block border-2 border-ink bg-paper p-5 shadow-[5px_5px_0_0_#0C0C0A]">
            <span className="flex items-center justify-between">
              <span className="sidebar-heading !mb-0">Browse the archive</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:text-rosewood" />
            </span>
          </Link>
        )}
      </aside>
    </div>
  );
}

export default function CurrentIssuePage() {
  const [issue, setIssue] = useState(null);
  const [browse, setBrowse] = useState([]);
  const [browseMode, setBrowseMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadIssue = async () => {
    setError('');
    try {
      const { data } = await api.issues.current();
      setIssue(data.issue);
    } catch (e) {
      setError(handleError(e).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssue();
  }, []);

  const handleFilter = useMemo(
    () =>
      (filters) => {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.language) params.language = filters.language;
        if (filters.q) params.q = filters.q;
        api.articles
          .list(params)
          .then(({ data }) => {
            setBrowse(data.articles);
            setBrowseMode(true);
          })
          .catch(() => {});
      },
    []
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rosewood" />
      </div>
    );
  }

  return (
    <div className="bg-paper text-ink">
      <Hero issue={issue} />

      <Ticker
        items={['കവിതകൾ · Poems', 'Short Stories', 'Book Reviews', 'Essays', 'Malayalam', 'English']}
      />
      <Ticker
        items={['Issue ' + (issue?.issueNumber ?? '—'), issue?.title || 'This Week', 'Words Worth Keeping', 'വാക്കുകൾക്ക് വീട്']}
        variant="accent"
        reverse
      />

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">// Browse</p>
            <h2 className="section-head">The Edition</h2>
          </div>
          <p className="max-w-xs text-[0.78rem] leading-relaxed opacity-50">
            Filter by category and language, or search by author and title.
            Writers sign in to submit their work.
          </p>
        </Reveal>

        <div className="mb-10">
          <FilterBar onFilter={handleFilter} />
        </div>

        {error && !browseMode && (
          <p className="mb-6 border-2 border-rosewood bg-rosewood/10 px-4 py-3 text-sm text-ink">
            {error} — <Link to="/register" className="underline">Become an author</Link> to publish the first edition.
          </p>
        )}

        {browseMode ? (
          browse.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {browse.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          ) : (
            <Reveal className="border-2 border-ink bg-paper p-12 text-center shadow-[6px_6px_0_0_#0C0C0A]">
              <p className="font-display text-2xl uppercase opacity-60">Nothing matched your search.</p>
            </Reveal>
          )
        ) : (
          <FeaturedLayout articles={issue?.articles || []} issue={issue} />
        )}
      </section>
    </div>
  );
}