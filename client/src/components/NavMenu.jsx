// navmenu.jsx
// the small wave button in the top right corner of every page.
// click it to jump between: 1) the landing page  2) the surf checker  3) the field guide  4) the t&c
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteText } from '../data/siteText';
import '../styles/nav.css';

// the four places you can go. "to" is the url. the t&c is the bottom of the landing page (#terms).
// the words (label and note) come from data/sitetext.js, in the same order as this list.
const places = [
  { to: '/', match: (p, h) => p === '/' && h !== '#terms' },
  { to: '/check', match: (p) => p === '/check' },
  { to: '/learn', match: (p) => p === '/learn' },
  { to: '/#terms', match: (p, h) => p === '/' && h === '#terms' },
];
const links = places.map((place, i) => ({ ...place, ...siteText.menu.links[i] }));

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const { pathname, hash } = useLocation();

  // close the menu after you go somewhere
  useEffect(() => setOpen(false), [pathname, hash]);

  // close the menu when you click somewhere else or press escape
  useEffect(() => {
    const handleClick = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <nav className="nav-menu" ref={box} aria-label="Site menu">
      <button className="nav-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={siteText.menu.buttonLabel}>
        {/* three little waves */}
        <svg viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
          <path d="M3 10 Q8 5 13 10 T23 10 T29 10" />
          <path d="M3 17 Q8 12 13 17 T23 17 T29 17" />
          <path d="M3 24 Q8 19 13 24 T23 24 T29 24" />
        </svg>
      </button>

      {open && (
        <div className="nav-panel">
          {links.map((link, i) => (
            <Link key={link.to} to={link.to} className={`nav-link ${link.match(pathname, hash) ? 'active' : ''}`}>
              <span className="nav-num">{i + 1}</span>
              <span className="nav-text">
                {link.label}
                {link.note && <small>{link.note}</small>}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
