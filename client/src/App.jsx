// app.jsx decides which page to show based on the url.
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Checker from './pages/Checker.jsx';
import Learn from './pages/Learn.jsx';
import NavMenu from './components/NavMenu.jsx';
import NavBar from './components/NavBar.jsx';
import { siteText } from './data/siteText';

export default function App() {
  const { pathname, hash } = useLocation();

  // every time the page changes, jump back to the top
  // (unless the url has a #hash like /#terms, because then the landing page scrolls to that spot itself)
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  // which menu style to use (set in data/sitetext.js)
  const useBar = siteText.navStyle === 'bar';
  useEffect(() => {
    document.documentElement.classList.toggle('has-nav-bar', useBar);
  }, [useBar]);

  return (
    <>
    {/* the menu, always visible: a top bar or the wave button */}
    {useBar ? <NavBar /> : <NavMenu />}
    <Routes>
      {/* the pretty landing page */}
      <Route path="/" element={<Landing />} />
      {/* the real surf calculator */}
      <Route path="/check" element={<Checker />} />
      {/* the field guide: surf basics, dos and don'ts */}
      <Route path="/learn" element={<Learn />} />
      {/* anything else also shows the landing page */}
      <Route path="*" element={<Landing />} />
    </Routes>
    </>
  );
}
