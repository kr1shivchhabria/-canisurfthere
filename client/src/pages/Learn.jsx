// learn.jsx
// the surf field guide. a totally different look from the landing page on purpose:
// warm paper, a serif font, a table of contents that follows you, and diagrams that draw themselves.
//
// tools used here (all the repos you picked):
//   gsap + scrolltrigger  -> progress bar, drawing diagrams, cards rising, highlighter pen
//   lenis                 -> smooth scrolling
//   vanta                 -> the sky and clouds in the hero
//   react-bits style      -> scrollreveal, marquee, tiltcard, spotlightcard, magnetbutton, countup
//   awesome-design-md     -> the design rules are written down in design.md
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import VantaClouds from '../components/VantaClouds.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import Rich from '../components/Rich.jsx';
import Marquee from '../components/Marquee.jsx';
import TiltCard from '../components/TiltCard.jsx';
import SpotlightCard from '../components/SpotlightCard.jsx';
import MagnetButton from '../components/MagnetButton.jsx';
import CountUp from '../components/CountUp.jsx';
import { diagrams } from '../components/learn/Diagrams.jsx';
import { gsap, ScrollTrigger } from '../lib/gsap';
import useSmoothScroll from '../lib/useSmoothScroll';
import { sections, chapters, localBreaks, flags, dos, donts, checklist, emergency, marqueeWords } from '../data/learnContent';
import '../styles/learn.css';

// turns "some ==highlighted== text" into text with a highlighter pen effect on the marked words
function Marked({ text }) {
  return text.split('==').map((part, i) =>
    i % 2 === 1 ? <mark key={i} className="marker">{part}</mark> : <span key={i}>{part}</span>
  );
}

// the big number + title that start every section
function SectionHead({ number, title, note }) {
  return (
    <header className="section-head">
      <span className="chapter-num" aria-hidden="true">{String(number).padStart(2, '0')}</span>
      <div>
        {note && <p className="chapter-note">{note}</p>}
        <h2 className="chapter-title">{title}</h2>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------- a normal chapter
function Chapter({ id, number, data }) {
  const Diagram = data.diagram ? diagrams[data.diagram] : null;
  return (
    <section className="chapter" id={id}>
      <SectionHead number={number} title={data.title} note={data.note} />
      <p className="chapter-intro"><Marked text={data.intro} /></p>

      {Diagram && (
        <div className="diagram reveal">
          <Diagram />
        </div>
      )}

      <div className="points">
        {data.points.map((point) => (
          <TiltCard key={point.h} className="point reveal">
            <h3>{point.h}</h3>
            <p>{point.p}</p>
          </TiltCard>
        ))}
      </div>

      {data.table && (
        <table className="wetsuit-table reveal">
          <thead>
            <tr>{data.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.table.rows.map((row) => (
              <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}

      {/* how our meter treats this topic, so the guide connects back to the real tool */}
      <aside className="meter-note reveal">
        <span className="meter-note-label">how the meter treats it</span>
        <p>{data.meter}</p>
      </aside>
    </section>
  );
}

// ---------------------------------------------------------------- the three la jolla breaks
function LocalSection({ id, number }) {
  return (
    <section className="chapter" id={id}>
      <SectionHead number={number} title="La Jolla: three breaks, three personalities" note="where this all started" />
      <p className="chapter-intro">
        <Marked text="The checker starts with three spots near UCSD. They are very different waves, and ==knowing the personality of your beach== matters as much as any number." />
      </p>
      <div className="local-grid">
        {localBreaks.map((spot) => (
          <SpotlightCard key={spot.name} className="local-card reveal">
            <span className="local-type">{spot.type}</span>
            <h3>{spot.name}</h3>
            <p>{spot.text}</p>
          </SpotlightCard>
        ))}
      </div>
      <p className="small-print">These are general descriptions, not a replacement for local knowledge or a lifeguard's advice.</p>
    </section>
  );
}

// ---------------------------------------------------------------- beach flags
function FlagsSection({ id, number }) {
  return (
    <section className="chapter" id={id}>
      <SectionHead number={number} title="Beach flags, decoded" note="read the flag before the water" />
      <p className="chapter-intro">
        <Marked text="Lifeguards use colored flags to say how risky the water is. ==Always read the flag and the sign== first, because meanings can vary a little from beach to beach." />
      </p>
      <div className="flag-grid">
        {flags.map((flag) => (
          <div className="flag-card reveal" key={flag.name}>
            {/* a flag drawn with css: a pole and a colored swallowtail */}
            <div className="flag-art" aria-hidden="true">
              <span className="flag-pole" />
              <span className={`flag-cloth ${flag.color === 'checker' ? 'checker' : ''}`} style={flag.color !== 'checker' ? { background: flag.color } : undefined} />
              {flag.double && <span className="flag-cloth second" style={{ background: flag.color }} />}
            </div>
            <div>
              <h3>{flag.name}</h3>
              <p>{flag.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- dos and don'ts
function RulesSection({ id, number }) {
  return (
    <section className="chapter" id={id}>
      <SectionHead number={number} title="The dos and don'ts" note="if you only read one part, read this" />
      <div className="rules-grid">
        <div>
          <h3 className="rules-title dos-title">Do</h3>
          {dos.map((text) => (
            <TiltCard key={text} className="rule do reveal" max={5}>
              <Check size={22} className="rule-icon" />
              <p>{text}</p>
            </TiltCard>
          ))}
        </div>
        <div>
          <h3 className="rules-title donts-title">Don't</h3>
          {donts.map((text) => (
            <TiltCard key={text} className="rule dont reveal" max={5}>
              <X size={22} className="rule-icon" />
              <p>{text}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- an interactive checklist
function GearSection({ id, number }) {
  const [checked, setChecked] = useState([]); // the numbers of the items you ticked

  const toggle = (i) => setChecked((list) => (list.includes(i) ? list.filter((n) => n !== i) : [...list, i]));
  const done = checked.length === checklist.length;

  return (
    <section className="chapter" id={id}>
      <SectionHead number={number} title="Before you paddle out" note="tick them off, for real" />
      <div className="checklist reveal">
        <p className="checklist-count">
          <span className="checklist-big"><CountUp to={checked.length} duration={0.4} /></span>
          <span> of {checklist.length} ready</span>
        </p>
        {/* a progress bar that fills as you tick things */}
        <div className="checklist-bar"><div style={{ width: `${(checked.length / checklist.length) * 100}%` }} /></div>
        <ul>
          {checklist.map((text, i) => (
            <li key={text}>
              <button className={checked.includes(i) ? 'on' : ''} onClick={() => toggle(i)} aria-pressed={checked.includes(i)}>
                <span className="box">{checked.includes(i) && <Check size={18} />}</span>
                {text}
              </button>
            </li>
          ))}
        </ul>
        <p className={`checklist-done ${done ? 'show' : ''}`}>All set. Have a great surf session and stay safe!</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- emergency steps
function EmergencySection({ id, number }) {
  return (
    <section className="chapter" id={id}>
      <SectionHead number={number} title="If something goes wrong" note="read this before you need it" />
      <ol className="emergency">
        {emergency.map((step, i) => (
          <li key={step.h} className="reveal">
            <span className="emergency-num">{i + 1}</span>
            <div>
              <h3>{step.h}</h3>
              <p>{step.p}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ================================================================ the page
export default function Learn() {
  useSmoothScroll(); // lenis
  const page = useRef(null);
  const [active, setActive] = useState(sections[0].id); // which section the table of contents highlights

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. the reading progress bar at the top of the screen
      gsap.to('.learn-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: page.current, start: 'top top', end: 'bottom bottom', scrub: 0.2 },
      });

      // 2. the giant chapter numbers drift upward a little slower than the page (parallax)
      gsap.utils.toArray('.chapter-num').forEach((el) => {
        gsap.fromTo(el, { yPercent: 25 }, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: { trigger: el.closest('.chapter'), start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // 3. diagrams draw themselves like a pen (the strokes use pathlength 1)
      gsap.utils.toArray('.diagram').forEach((box) => {
        gsap.from(box.querySelectorAll('.draw'), {
          strokeDashoffset: 1,
          duration: 1.8,
          ease: 'power2.out',
          stagger: 0.18,
          scrollTrigger: { trigger: box, start: 'top 80%' },
        });
      });

      // 4. anything with the class "reveal" rises into view, in small groups
      ScrollTrigger.batch('.reveal', {
        start: 'top 90%',
        once: true,
        onEnter: (items) => gsap.fromTo(items, { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out' }),
      });

      // 5. the highlighter pen: add the class "in" when a marked phrase is on screen (css does the drawing)
      ScrollTrigger.batch('.marker', {
        start: 'top 88%',
        once: true,
        onEnter: (items) => items.forEach((el) => el.classList.add('in')),
      });

      // 6. tell the table of contents which section we are in
      sections.forEach((s) => {
        ScrollTrigger.create({
          trigger: `#${s.id}`,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(s.id),
        });
      });
    }, page);
    return () => ctx.revert();
  }, []);

  // goes through each section in order and shows the right component for it
  const renderSection = (s, index) => {
    const number = index + 1;
    if (s.kind === 'chapter') return <Chapter key={s.id} id={s.id} number={number} data={chapters[s.id]} />;
    if (s.kind === 'local') return <LocalSection key={s.id} id={s.id} number={number} />;
    if (s.kind === 'flags') return <FlagsSection key={s.id} id={s.id} number={number} />;
    if (s.kind === 'rules') return <RulesSection key={s.id} id={s.id} number={number} />;
    if (s.kind === 'gear') return <GearSection key={s.id} id={s.id} number={number} />;
    return <EmergencySection key={s.id} id={s.id} number={number} />;
  };

  return (
    <div className="learn" ref={page}>
      <div className="learn-progress" />

      {/* ---------------- hero: vanta clouds ---------------- */}
      <header className="learn-hero">
        <VantaClouds />
        <nav className="learn-nav">
          <Link to="/" className="learn-back"><ArrowLeft size={18} /> CanISurfThere</Link>
          <Link to="/check" className="learn-nav-check">Check the surf <ArrowRight size={18} /></Link>
        </nav>
        <div className="learn-hero-text">
          <p className="hand learn-by">a field guide by krishiv</p>
          <h1>The Surf<br /><em>Field Guide</em></h1>
          <ScrollReveal
            className="learn-sub"
            start="top 95%"
            end="top 60%"
            text="What the numbers on the meter mean, as well as the dos and don'ts that you should probably follow."
          />
        </div>
        <p className="hand learn-cue">scroll to start reading</p>
      </header>

      <Marquee words={marqueeWords} />

      {/* ---------------- the body: table of contents + sections ---------------- */}
      <div className="learn-body">
        <aside className="rail" aria-label="Table of contents">
          <p className="rail-title">In this guide</p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={active === s.id ? 'active' : ''}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <main className="chapters">{sections.map(renderSection)}</main>
      </div>

      {/* ---------------- final call to action ---------------- */}
      <section className="learn-final">
        <p className="hand">alright now go check with the ocean itself</p>
        <h2>Ready to see if today is a surf day?</h2>
        <MagnetButton>
          <Link to="/check" className="final-button">Open the surf checker</Link>
        </MagnetButton>
      </section>

      <footer className="learn-footer">
        <p>
          This guide is general education, not professional instruction. Ocean conditions change fast and every beach is different.
          Always follow lifeguard instructions and the posted signs. All CanISurfThere data is an estimate.
        </p>
        <p className="learn-fine">
          <Rich text="© 2026 Krishiv Chhabria. The CanISurfThere name, design, scoring method and calculated safety scores belong to Krishiv Chhabria. All rights reserved. Contact krchhabria@ucsd.edu for support." />
        </p>
      </footer>
    </div>
  );
}
