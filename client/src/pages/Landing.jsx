// the landing page, from top to bottom:
//   1. long ocean (title + subtitle)  ->  2. long sand (big button)   [scene]
//   3. why i built this, still on the sand                             [story]
//   4. a patch of ocean with a surfer and the field guide prompt       [learnprompt]
//   5. the disclaimer (t&c) and the fine print, back on the sand       [disclaimer]
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Scene from '../components/Scene.jsx';
import Story from '../components/Story.jsx';
import LearnPrompt from '../components/LearnPrompt.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import useSmoothScroll from '../lib/useSmoothScroll';
import '../styles/landing.css';

export default function Landing() {
  useSmoothScroll(); // lenis smooth scrolling on this page
  const { hash } = useLocation();

  // the "t&c" link in the wave menu goes to /#terms. scroll down to the fine print when we see that.
  useEffect(() => {
    if (hash !== '#terms') return;
    const wait = setTimeout(() => {
      document.getElementById('terms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120); // a tiny wait so the page has finished drawing
    return () => clearTimeout(wait);
  }, [hash]);

  return (
    <main className="landing">
      <Scene />
      <Story />
      <LearnPrompt />
      <Disclaimer />
    </main>
  );
}
