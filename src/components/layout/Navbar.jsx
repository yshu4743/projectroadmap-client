import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LogoMark() {
  return (
    <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center border-2 border-rosewood">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#FF3E00" strokeWidth="2.5" />
        <line x1="12" y1="2" x2="12" y2="22" stroke="#FF3E00" strokeWidth="2" />
      </svg>
    </span>
  );
}

function UtcClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utc =
    now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'UTC' }) + ' UTC';

  return <span className="min-w-[6.5em] text-right opacity-70">{utc}</span>;
}

const navClass = ({ isActive }) =>
  `flex h-11 items-center px-4 ${isActive ? 'active' : ''}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const close = () => setOpen(false);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-11 max-w-[1440px] items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link to="/" onClick={close} className="flex items-center gap-2 whitespace-nowrap">
            <LogoMark />
            <span className="font-display text-[0.8rem] tracking-wide uppercase">
              ee lakhyam<span className="text-rosewood">.</span>
            </span>
          </Link>
          <span className="h-4 w-px bg-white/15" />
          <span className="hidden text-[0.62rem] uppercase tracking-[0.14em] opacity-40 md:inline">
            Weekly Magazine
          </span>
        </div>

        <nav className="site-header__nav hidden h-11 items-stretch md:flex">
          <NavLink to="/" end className={navClass}>
            Current Issue
          </NavLink>
          <NavLink to="/archive" className={navClass}>
            Archive
          </NavLink>
          {user?.role === 'author' && (
            <NavLink to="/author" className={navClass}>
              Author Desk
            </NavLink>
          )}
          {user?.role === 'editor' && (
            <NavLink to="/editor" className={navClass}>
              Editorial Desk
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-[0.62rem] uppercase tracking-[0.14em] lg:flex">
            <span className="status-dot" />
            <span>{user ? user.name : 'Reading Room'}</span>
          </span>
          <UtcClock />
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden border-2 border-white/20 px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-paper transition hover:bg-rosewood hover:border-rosewood sm:block"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden border-2 border-rosewood px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-rosewood transition hover:bg-rosewood hover:text-paper sm:block"
            >
              Login
            </Link>
          )}
          <button
            className="flex flex-col gap-1 p-1 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`h-0.5 w-5 bg-paper transition ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`h-0.5 w-5 bg-paper transition ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 bg-paper transition ${open ? '-translate-y-2.5 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="site-header__nav absolute inset-x-0 top-11 flex flex-col border-b-2 border-rosewood bg-ink md:hidden">
          <NavLink to="/" end className={navClass} onClick={close}>
            Current Issue
          </NavLink>
          <NavLink to="/archive" className={navClass} onClick={close}>
            Archive
          </NavLink>
          {user?.role === 'author' && (
            <NavLink to="/author" className={navClass} onClick={close}>
              Author Desk
            </NavLink>
          )}
          {user?.role === 'editor' && (
            <NavLink to="/editor" className={navClass} onClick={close}>
              Editorial Desk
            </NavLink>
          )}
          {user ? (
            <button className={`${navClass({ isActive: false })} w-full text-left`} onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <Link to="/register" className={navClass} onClick={close}>
              Become an author
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}