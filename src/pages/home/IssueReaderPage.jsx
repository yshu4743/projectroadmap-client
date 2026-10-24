import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { api, handleError } from '../../api/client';
import ArticleCard from '../../components/article/ArticleCard';
import { hasMalayalam } from '../../lib/constants';

export default function IssueReaderPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.issues
      .one(id)
      .then(({ data }) => setIssue(data.issue))
      .catch((e) => setError(handleError(e).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-rosewood" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-serif text-xl text-fadedink">{error || 'Edition not found'}</p>
        <Link to="/archive" className="btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" /> Archive
        </Link>
      </div>
    );
  }

  const featured = issue.articles?.[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/archive" className="btn-ghost -ml-3">
          <ArrowLeft className="h-4 w-4" /> Archive
        </Link>
        <span className="flex items-center gap-2 text-sm text-fadedink">
          <Calendar className="h-4 w-4" />
          {new Date(issue.releaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="border-y-4 border-double border-ink py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rosewood">Issue {issue.issueNumber}</p>
        <h1 className={`mt-2 text-4xl sm:text-5xl ${hasMalayalam(issue.title) ? 'malayalam malayalam-bold' : 'font-serif'}`}>
          {issue.title}
        </h1>
        {issue.coverImageURL && (
          <img src={issue.coverImageURL} alt="" className="mx-auto mt-6 max-h-64 rounded-lg object-cover shadow-lg" />
        )}
      </div>

      {featured && (
        <div className="mt-8">
          <ArticleCard article={featured} featured />
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(issue.articles || []).slice(1).map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </div>
  );
}