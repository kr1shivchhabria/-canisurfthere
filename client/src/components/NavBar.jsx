// navbar.jsx
// the second menu style: a few small bubbles centered at the very top of every page. it scrolls away with the page.
// switch between this and the wave button with "navStyle" in data/sitetext.js.
import { Link, useLocation } from 'react-router-dom';
import { siteText } from '../data/siteText';
import '../styles/nav.css';

// same four places as the wave menu. "match" marks the page you are on
const places = [
  { to: '/', match: (p, h) => p === '/' && h !== '#terms' },
  { to: '/check', match: (p) => p === '/check' },
  { to: '/learn', match: (p) => p === '/learn' },
  { to: '/#terms', match: (p, h) => p === '/' && h === '#terms' },
];
const links = places.map((place, i) => ({ ...place, ...siteText.menu.links[i] }));

export default function NavBar() {
  const { pathname, hash } = useLocation();
  return (
    <nav className="nav-bar" aria-label="Site menu">
      {/* four small bubbles, centered at the very top. no logo, no bar */}
      <div className="nav-bar-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={`nav-bar-link ${link.match(pathname, hash) ? 'active' : ''}`}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
