// the big half-circle meter. red on the left (avoid), green on the right (ideal).
// the needle swings to the score with a little bounce.
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { siteText } from '../data/siteText';

// the gauge is drawn on a 300 x 185 canvas, with the center of the circle at (150, 150)
const CENTER = 150;

// build the little tick marks around the arc (every 10 points)
const ticks = Array.from({ length: 11 }, (_, i) => {
  const angle = Math.PI * (1 - i / 10); // pi = left end, 0 = right end
  const inner = 104;
  const outer = i % 5 === 0 ? 92 : 98; // longer ticks at 0, 50 and 100
  return {
    x1: CENTER + inner * Math.cos(angle),
    y1: CENTER - inner * Math.sin(angle),
    x2: CENTER + outer * Math.cos(angle),
    y2: CENTER - outer * Math.sin(angle),
  };
});

export default function SurfMeter({ score }) {
  const needle = useRef(null);

  // put the needle on the far left (score 0) when the meter first appears
  useEffect(() => {
    gsap.set(needle.current, { rotation: -90, svgOrigin: `${CENTER} ${CENTER}` });
  }, []);

  // every time the score changes, swing the needle
  // score 0 = -90 degrees (pointing left), 50 = 0 (straight up), 100 = +90 (pointing right)
  useEffect(() => {
    const angle = score == null ? -90 : -90 + score * 1.8;
    gsap.to(needle.current, {
      rotation: angle,
      svgOrigin: `${CENTER} ${CENTER}`,
      duration: prefersReducedMotion() ? 0 : 1.8,
      ease: 'elastic.out(1, 0.55)',
    });
  }, [score]);

  return (
    <svg viewBox="0 0 300 185" className="meter-svg" role="img" aria-label={score == null ? 'Safety meter, no data' : `Safety meter showing ${score} out of 100`}>
      <defs>
        {/* the color band: red -> orange -> yellow -> green */}
        <linearGradient id="meterGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#e5484d" />
          <stop offset="30%" stopColor="#f5922b" />
          <stop offset="50%" stopColor="#f2d53c" />
          <stop offset="75%" stopColor="#8fd24a" />
          <stop offset="100%" stopColor="#25b05a" />
        </linearGradient>
      </defs>

      {/* the colored arc: starts at the left (20,150), curves over the top, ends at the right (280,150) */}
      <path d="M 20 150 A 130 130 0 0 1 280 150" fill="none" stroke="url(#meterGradient)" strokeWidth="24" strokeLinecap="round" />

      {/* tick marks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#0b4a75" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      ))}

      {/* the needle (we rotate this group with gsap) */}
      <g ref={needle}>
        <polygon points="145,150 155,150 150,48" fill="#072f4d" />
      </g>
      <circle cx={CENTER} cy={CENTER} r="12" fill="#072f4d" />
      <circle cx={CENTER} cy={CENTER} r="4" fill="#ecd9ad" />

      {/* end labels */}
      <text x="20" y="178" textAnchor="middle" className="meter-end">{siteText.checker.meterEnds.low}</text>
      <text x="280" y="178" textAnchor="middle" className="meter-end">{siteText.checker.meterEnds.high}</text>
    </svg>
  );
}
