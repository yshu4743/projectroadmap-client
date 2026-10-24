import { Link } from 'react-router-dom';

function BackToTop() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <button
      onClick={scrollTop}
      className="font-mono text-[0.6rem] uppercase tracking-[0.15em] opacity-40 transition hover:opacity-100 hover:text-rosewood"
    >
      ↑ Back to Top
    </button>
  );
}

export default function Footer() {
  return (
    <footer className="border-t-4 border-ink bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="grid grid-cols-12 gap-6 border-b border-white/15 py-12">
          <div className="col-span-12 mb-6 md:col-span-5 md:mb-0">
            <h2 className="font-display text-3xl leading-none uppercase">
              ee lakhyam<span className="text-rosewood">.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[0.8rem] leading-relaxed opacity-45">
              A weekly digital magazine curated for — and by — the writers of our local
              library. വാക്കുകൾക്ക് വീട് നൽകുന്നു.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="tag tag--accent">Malayalam</span>
              <span className="tag tag--safe">English</span>
              <span className="tag">Est. 2026</span>
            </div>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="eyebrow !text-[0.58rem] mb-4">Navigate</p>
            <ul className="space-y-3 text-[0.8rem] opacity-50">
              <li><Link to="/" className="hover:text-rosewood hover:opacity-100">Current Issue</Link></li>
              <li><Link to="/archive" className="hover:text-rosewood hover:opacity-100">Archive</Link></li>
              <li><Link to="/register" className="hover:text-rosewood hover:opacity-100">Submit a piece</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="eyebrow !text-[0.58rem] mb-4">Roles</p>
            <ul className="space-y-3 text-[0.8rem] opacity-50">
              <li><Link to="/login" className="hover:text-rosewood hover:opacity-100">Authors</Link></li>
              <li><Link to="/login" className="hover:text-rosewood hover:opacity-100">Editors</Link></li>
              <li><Link to="/archive" className="hover:text-rosewood hover:opacity-100">Readers</Link></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <p className="eyebrow !text-[0.58rem] mb-4">The Library</p>
            <p className="max-w-xs text-[0.8rem] leading-relaxed opacity-45">
              Local Library Reading Circle — every word published here began at our
              reading table.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 py-5">
          <span className="font-mono text-[0.6rem] tracking-[0.05em] text-white/35">
            © 2026 ee lakhyam &nbsp;|&nbsp; designed in the Axis Industrial style &nbsp;|&nbsp;
            <a href="https://templatemo.com/tm-619-axis-industrial" target="_blank" rel="nofollow noopener" className="text-rosewood hover:underline">
              TemplateMo
            </a>
          </span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}