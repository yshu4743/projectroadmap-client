import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORY_LABELS, LANGUAGE_LABELS, hasMalayalam } from '../../lib/constants';

export default function ArticleCard({ article }) {
  const isMalayalam = hasMalayalam(article.title);
  const titleClass = isMalayalam
    ? 'malayalam malayalam-bold !text-[1.35rem] !leading-[1.3]'
    : 'font-display';

  return (
    <Link
      to={`/articles/${article._id}`}
      className="group relative flex h-full flex-col border-2 border-ink bg-paper p-6 shadow-[5px_5px_0_0_#0C0C0A] transition-none hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0_0_#FF3E00]"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag tag--filled">
            {CATEGORY_LABELS[article.category] || article.category}
          </span>
          <span className="tag">
            {LANGUAGE_LABELS[article.language] || article.language}
          </span>
        </div>
        <ArrowUpRight className="h-5 w-5 opacity-30 transition group-hover:opacity-100 group-hover:text-rosewood" />
      </div>

      <h3
        className={`${titleClass} text-xl font-bold leading-tight text-ink uppercase transition group-hover:text-rosewood`}
      >
        {article.title}
      </h3>

      {article.excerpt && (
        <p className="mt-3 text-[0.8rem] leading-relaxed text-fadedink">{article.excerpt}</p>
      )}

      <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-ink/25 pt-4 text-[0.62rem] uppercase tracking-[0.14em]">
        <span className="font-mono text-fadedink">{article.author?.name || 'Unknown'}</span>
        <span className="font-mono text-fadedink/70">
          {new Date(article.createdAt).toLocaleDateString('en-GB')}
        </span>
      </div>
    </Link>
  );
}