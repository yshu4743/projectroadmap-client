import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Minus, Plus, Share2, Tag, Globe } from 'lucide-react';
import { api, handleError } from '../../api/client';
import { CATEGORY_LABELS, LANGUAGE_LABELS, hasMalayalam } from '../../lib/constants';

const SIZES = [
  { key: 'sm', label: 'Small', factor: 1 },
  { key: 'md', label: 'Medium', factor: 1.15 },
  { key: 'lg', label: 'Large', factor: 1.3 },
];

export default function ArticleReaderPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fontSize, setFontSize] = useState(1.15);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.articles
      .one(id)
      .then(({ data }) => setArticle(data.article))
      .catch((e) => setError(handleError(e).message))
      .finally(() => setLoading(false));
  }, [id]);

  const share = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-rosewood" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-serif text-xl text-fadedink">{error || 'Article not found'}</p>
        <Link to="/" className="btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to this week
        </Link>
      </div>
    );
  }

  const isMalayalam = hasMalayalam(article.title) || article.language === 'malayalam';

  return (
    <article className="min-h-screen">
      <div className="border-b editorial-rule bg-white/60">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="btn-ghost -ml-3">
              <ArrowLeft className="h-4 w-4" /> Library
            </Link>
            <div className="flex items-center gap-2">
              <span className="flex items-center rounded-full border border-fadedink/20 px-3 py-1 text-xs font-semibold text-fadedink">
                <Minus className="mr-1 h-3 w-3" /> {fontSize.toFixed(2)}x <Plus className="ml-1 h-3 w-3" />
              </span>
              {SIZES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setFontSize(s.factor)}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                    fontSize === s.factor ? 'bg-ink text-paper' : 'bg-fadedink/10 text-fadedink hover:bg-fadedink/20'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <button onClick={share} className="btn-ghost" title="Copy link">
                {copied ? 'Copied!' : <Share2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12" style={{ fontSize: `${fontSize}rem` }}>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className="flex items-center gap-1 rounded-full bg-saffron/10 px-2.5 py-1 text-saffron">
            <Tag className="h-3 w-3" /> {CATEGORY_LABELS[article.category]}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-brass/10 px-2.5 py-1 text-brass">
            <Globe className="h-3 w-3" /> {LANGUAGE_LABELS[article.language]}
          </span>
        </div>

        <h1
          className={`leading-tight text-ink ${isMalayalam ? 'malayalam malayalam-bold' : 'font-serif'} text-4xl sm:text-5xl`}
        >
          {article.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 border-y editorial-rule py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-moss/10 font-serif text-sm font-bold text-moss">
            {(article.author?.name || 'A')[0]}
          </div>
          <div>
            <p className="font-semibold">{article.author?.name}</p>
            <p className="text-xs text-fadedink">
              {article.author?.libraryCardNumber
                ? `Library member · ${article.author.libraryCardNumber}`
                : 'Library contributor'}
              {article.author?.bio ? ` · ${article.author.bio}` : ''}
            </p>
          </div>
        </div>

        <div
          className={`prose-article mt-8 ${isMalayalam ? 'malayalam' : ''}`}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 border-t editorial-rule pt-6 text-sm text-fadedink">
          <p className="italic">
            Published in the reading circle, {new Date(article.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </div>
      </div>
    </article>
  );
}