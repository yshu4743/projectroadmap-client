import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive as ArchiveIcon, Calendar, FileText, Loader2 } from 'lucide-react';
import { api, handleError } from '../../api/client';

export default function ArchivePage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.issues
      .archive()
      .then(({ data }) => setIssues(data.issues))
      .catch((e) => setError(handleError(e).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-rosewood" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-center">
        <ArchiveIcon className="mx-auto h-8 w-8 text-rosewood" />
        <h1 className="font-serif mt-3 text-4xl font-bold">The Archive</h1>
        <p className="mt-2 text-fadedink">
          Every weekly edition of ee lakhyam, bound in the library's digital shelf.
        </p>
      </header>

      {error && <p className="mb-6 rounded-lg border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron">{error}</p>}

      {issues.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-serif text-xl text-fadedink">No past editions yet.</p>
          <p className="mt-1 text-sm text-fadedink/70">The first issue will find its shelf soon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <Link
              key={issue._id}
              to={`/issue/${issue._id}`}
              className="group flex flex-col gap-4 rounded-xl bg-white/70 p-6 shadow-editorial transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rosewood font-serif text-lg font-bold text-paper">
                #{issue.issueNumber}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-fadedink">
                  {new Date(issue.releaseDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h2 className="font-serif mt-1 text-xl font-semibold group-hover:text-rosewood">{issue.title}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-fadedink">
                <FileText className="h-4 w-4" />
                {issue.articleCount} piece{issue.articleCount === 1 ? '' : 's'}
                {index === 0 && (
                  <span className="ml-2 rounded-full bg-moss/10 px-2.5 py-0.5 text-xs font-semibold text-moss">
                    Latest
                  </span>
                )}
              </div>
              <Calendar className="ml-2 hidden h-4 w-4 text-fadedink/50 sm:block" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}