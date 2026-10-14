// scene.jsx
// the top of the landing page, built as one long scene:
//   1. a long ocean, with the title and subtitle floating on the water
//   2. the shoreline, where water slides up the wet sand
//   3. a long stretch of sand with the big button and beach decorations around it
// the ocean canvas is taller than the ocean part, so the shoreline pours over the top of the sand.
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import OceanCanvas from './OceanCanvas.jsx';
import SplitHeading from './SplitHeading.jsx';
import MagnetButton from './MagnetButton.jsx';
import Deco, { CurlyArrow, Gull } from './Decorations.jsx';
import Rich from './Rich.jsx';
import { siteText } from '../data/siteText';
import { gsap, prefersReducedMotion } from '../lib/gsap';

// all the words come from data/sitetext.js
const hero = siteText.landing.hero;
const btn = siteText.landing.button;

// decorations around the button. position them with left/right/top/bottom (in percent of the button screen).
// size controls how big, depth controls how much it moves when the mouse moves,
// rotate tilts it, delay offsets its idle animation, hidesmall hides it on phones, cls adds a css class.
const decorations = [
  { name: 'umbrella', style: { left: '3%', top: '30%', width: 'clamp(110px, 14vw, 230px)' }, depth: 0.5, rotate: -10 },
  { name: 'castle', style: { left: '6%', bottom: '9%', width: 'clamp(130px, 17vw, 280px)' }, depth: 0.9, cls: 'castle-deco' },
  { name: 'ball', style: { left: '19%', top: '21%', width: 'clamp(50px, 6vw, 96px)' }, depth: 1.4, rotate: 12 },
  { name: 'crab', style: { right: '13%', top: '27%', width: 'clamp(70px, 9vw, 150px)' }, depth: 1.2 },
  { name: 'crab', style: { left: '24%', bottom: '25%', width: 'clamp(50px, 6vw, 100px)' }, depth: 1.6, delay: 1.2, hideSmall: true },
  { name: 'board', style: { right: '3.5%', top: '36%', width: 'clamp(50px, 6vw, 100px)' }, depth: 0.6, rotate: 7, cls: 'board-deco' },
  { name: 'bucket', style: { right: '24%', bottom: '10%', width: 'clamp(60px, 8vw, 130px)' }, depth: 1.1, rotate: -6, hideSmall: true },
  { name: 'ball', style: { right: '11%', bottom: '19%', width: 'clamp(46px, 5vw, 84px)' }, depth: 1.7, delay: 0.8, rotate: -20, hideSmall: true },
  { name: 'star', style: { left: '15%', bottom: '38%', width: 'clamp(40px, 5vw, 80px)' }, depth: 1.3, rotate: 18, hideSmall: true },
  { name: 'star', style: { left: '71%', bottom: '24%', width: 'clamp(34px, 4vw, 64px)' }, depth: 1.2, rotate: 40, hideSmall: true },
  { name: 'scallop', style: { left: '27%', top: '50%', width: 'clamp(34px, 4vw, 64px)' }, depth: 1.4, rotate: -14, hideSmall: true },
  { name: 'spiral', style: { right: '19%', bottom: '31%', width: 'clamp(34px, 4vw, 64px)' }, depth: 1.5, rotate: 20, hideSmall: true },
  { name: 'scallop', style: { right: '8%', bottom: '5%', width: 'clamp(40px, 5vw, 80px)' }, depth: 1.1, rotate: 24 },
];

// a few more things on the extra sand below the button, so the long beach does not feel empty
const tailDecorations = [
  { name: 'star', style: { left: '12%', top: '30%', width: 'clamp(40px, 5vw, 76px)' }, depth: 0.8, rotate: -12 },
  { name: 'spiral', style: { left: '36%', top: '62%', width: 'clamp(34px, 4vw, 60px)' }, depth: 1.1, rotate: 30 },
  { name: 'crab', style: { right: '30%', top: '38%', width: 'clamp(50px, 6vw, 96px)' }, depth: 1.2, delay: 0.6, hideSmall: true },
  { name: 'scallop', style: { right: '10%', top: '22%', width: 'clamp(38px, 4.5vw, 70px)' }, depth: 0.9, rotate: 16 },
  { name: 'ball', style: { left: '58%', top: '12%', width: 'clamp(40px, 4.5vw, 70px)' }, depth: 1.5, delay: 1.4, hideSmall: true },
];

export default function Scene() {
  const scene = useRef(null);
  const scrollCue = useRef(null); // the little fading arrow at the bottom of the first screen

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. the title and subtitle fade away gently as you scroll toward the sand
      gsap.to('.hero-content', {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: scene.current, start: 'top top', end: '+=60%', scrub: true },
      });

      // 2. the decorations pop in (random order) when the sand scrolls into view
      gsap.from('.cta-stage .deco-pop', {
        scale: 0,
        rotation: -30,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.8)',
        stagger: { each: 0.07, from: 'random' },
        scrollTrigger: { trigger: '.cta-stage', start: 'top 65%' },
      });
      gsap.from('.cta-tail .deco-pop', {
        scale: 0,
        rotation: -30,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.8)',
        stagger: { each: 0.1, from: 'random' },
        scrollTrigger: { trigger: '.cta-tail', start: 'top 85%' },
      });

      // 3. the big button bounces in
      gsap.from('.cta-pop', {
        scale: 0.6,
        opacity: 0,
        duration: 1.3,
        ease: 'elastic.out(1, 0.55)',
        scrollTrigger: { trigger: '.cta-stage', start: 'top 55%' },
      });
    }, scene);

    // 4. mouse parallax: things closer to you (bigger depth number) move more
    const movers = gsap.utils.toArray('.deco', scene.current).map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
      depth: parseFloat(el.dataset.depth),
    }));
    const handleMouse = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5 to 0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(-nx * m.depth * 46);
        m.y(-ny * m.depth * 30);
      });
    };
    window.addEventListener('mousemove', handleMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      ctx.revert();
    };
  }, []);

  // turns a decoration from the lists above into a <deco>
  const place = (d, i) => (
    <Deco key={i} name={d.name} style={d.style} depth={d.depth} rotate={d.rotate} delay={d.delay} className={`${d.hideSmall ? 'hide-small' : ''} ${d.cls || ''}`} />
  );

  // hide the little scroll arrow as soon as the visitor starts scrolling
  useEffect(() => {
    const check = () => {
      if (scrollCue.current) scrollCue.current.classList.toggle('gone', window.scrollY > 40);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <div className="scene" ref={scene}>
      {/* a small white arrow that fades in and out under the scroll hint. it disappears once you scroll */}
      <svg className="scroll-cue" ref={scrollCue} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 8 L12 15 L19 8" />
      </svg>
      {/* the sand sits behind everything. the ocean canvas drapes over its top edge */}
      <div className="sand-bg" />
      <div className="ocean-stage">
        {/* shoreat 0.84 = the water ends 84% of the way down this tall canvas */}
        <OceanCanvas palette="shore" shore shoreAt={0.84} speed={1} crests={11} />
      </div>

      {/* ---------------- the long ocean ---------------- */}
      <header className="hero">
        {/* soft sunbeams drifting across the water (pure css animation) */}
        <div className="hero-rays" aria-hidden="true">
          <span className="ray ray-1" />
          <span className="ray ray-2" />
          <span className="ray ray-3" />
          <span className="ray ray-4" />
        </div>

        {/* seagulls gliding across (pure css animation) */}
        <Gull className="gull gull-1" />
        <Gull className="gull gull-2" />
        <Gull className="gull gull-3" />

        <div className="hero-content">
          <p className="hero-tag">{hero.tag}</p>
          <SplitHeading text={hero.title} className="hero-title" underline={[hero.underlinedWord]} emphasis={[hero.underlinedWord]} breakBeforeLast />
          <p className="hero-sub">{hero.subtitle}</p>
        </div>

        {/* a little note pointing at the wave menu button */}
        <div className="nav-hint" aria-hidden="true">
          {/* a simple arrow with a gentle bend: it starts above the words and its tip points at the wave button */}
          <svg className="hint-arrow" viewBox="0 0 36 60" preserveAspectRatio="none" fill="none" stroke="var(--sand)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 56 C 6 40, 13 25, 30 16" />
            <path d="M20 16 L30 16 L25 24.6" />
          </svg>
          <p className="hint-text">
            {hero.navHint.split('\n').map((line, i) => <span className="hint-line" key={i}>{line}</span>)}
          </p>
        </div>

        <p className="hero-scroll">{hero.scrollHint}</p>
      </header>

      {/* ---------------- the long sand ---------------- */}
      <section className="cta">
        {/* the first screen of sand: button + decorations */}
        <div className="cta-stage">
          {decorations.map(place)}

          <div className="cta-center">
            <p className="cta-intro">{btn.intro}</p>

            <div className="cta-pop">
              <MagnetButton>
                {/* a link styled like a button. it opens the real surf checker */}
                <Link to="/check" className="cta-button">
                  {btn.label}
                </Link>
              </MagnetButton>
            </div>

            {/* the instruction, with a hand-drawn arrow pointing up at the button */}
            <p className="cta-help">
              <CurlyArrow className="cta-arrow" />
              <span>
                <Rich text={btn.help} />
              </span>
            </p>
          </div>

          {/* the prompt at the bottom of the button screen */}
          <p className="scroll-note">
            {btn.scrollNote}
            <span className="scroll-note-arrow" aria-hidden="true">↓</span>
          </p>
        </div>

        {/* extra sand below, with a few more shells and critters */}
        <div className="cta-tail">{tailDecorations.map(place)}</div>
      </section>
    </div>
  );
}
