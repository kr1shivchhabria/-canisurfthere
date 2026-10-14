// diagrams.jsx
// three hand-drawn diagrams for the field guide. they are svgs, and every line with the class "draw"
// gets drawn in (like a pen) when you scroll to it. pathlength="1" lets gsap treat every line as length 1.

const NAVY = '#0b2a5c';
const SKY = '#4fb4ea';
const CORAL = '#ef6f5e';
const SAND = '#ecd9ad';

// a small helper for an arrow head at the end of a line
const Head = ({ x, y, angle, color = NAVY }) => (
  <polygon points="0,0 -14,-7 -14,7" fill={color} transform={`translate(${x} ${y}) rotate(${angle})`} />
);

// ---------------------------------------------------------------- wave anatomy
export function WaveDiagram() {
  // build one smooth wave line from 4 wiggles of a sine curve
  let d = '';
  for (let x = 20; x <= 620; x += 8) {
    const y = 130 - 55 * Math.sin(((x - 20) / 150) * Math.PI * 2);
    d += `${d ? 'L' : 'M'}${x} ${y.toFixed(1)} `;
  }
  return (
    <svg viewBox="0 0 640 280" className="diagram-svg" role="img" aria-label="A wave with its height and period labeled">
      {/* calm water level */}
      <line x1="20" y1="130" x2="620" y2="130" stroke={NAVY} strokeWidth="2" strokeDasharray="6 8" opacity="0.4" />
      {/* the wave */}
      <path className="draw" pathLength="1" d={d} fill="none" stroke={SKY} strokeWidth="7" strokeLinecap="round" />

      {/* height: the gap between crest and trough */}
      <line x1="20" y1="75" x2="620" y2="75" stroke={NAVY} strokeWidth="1.5" strokeDasharray="3 7" opacity="0.35" />
      <line x1="20" y1="185" x2="620" y2="185" stroke={NAVY} strokeWidth="1.5" strokeDasharray="3 7" opacity="0.35" />
      <line className="draw" pathLength="1" x1="585" y1="80" x2="585" y2="180" stroke={CORAL} strokeWidth="4" strokeLinecap="round" />
      <Head x={585} y={182} angle={90} color={CORAL} />
      <Head x={585} y={78} angle={-90} color={CORAL} />
      <text x="585" y="62" textAnchor="middle" className="diagram-hand" fill={CORAL}>height</text>

      {/* period: the distance between two crests */}
      <line className="draw" pathLength="1" x1="58" y1="38" x2="208" y2="38" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
      <Head x={210} y={38} angle={0} />
      <Head x={56} y={38} angle={180} />
      <line x1="58" y1="38" x2="58" y2="72" stroke={NAVY} strokeWidth="1.5" strokeDasharray="3 5" opacity="0.5" />
      <line x1="208" y1="38" x2="208" y2="72" stroke={NAVY} strokeWidth="1.5" strokeDasharray="3 5" opacity="0.5" />
      <text x="228" y="44" textAnchor="start" className="diagram-hand" fill={NAVY}>period = seconds between crests</text>

      {/* direction */}
      <line className="draw" pathLength="1" x1="40" y1="250" x2="170" y2="250" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
      <Head x={172} y={250} angle={0} />
      <text x="190" y="256" className="diagram-hand" fill={NAVY}>the way the swell travels</text>
    </svg>
  );
}

// ---------------------------------------------------------------- wind: offshore versus onshore
export function WindDiagram() {
  // draws one panel. "clean" panels get a smooth wave, "messy" panels get a bumpy one.
  const panel = (x0, clean) => {
    let d = `M${x0} 200 `;
    for (let x = 0; x <= 200; x += 5) {
      const smooth = Math.sin((x / 200) * Math.PI * 2) * 22;
      const bumpy = Math.sin((x / 200) * Math.PI * 2) * 12 + Math.sin(x * 0.55) * 7 + Math.sin(x * 1.3) * 3;
      d += `L${x0 + x} ${(150 + (clean ? smooth : bumpy)).toFixed(1)} `;
    }
    return d;
  };
  return (
    <svg viewBox="0 0 640 280" className="diagram-svg" role="img" aria-label="Offshore wind makes smooth waves, onshore wind makes bumpy waves">
      {[0, 330].map((x0, i) => {
        const clean = i === 0;
        return (
          <g key={i}>
            {/* water */}
            <path className="draw" pathLength="1" d={panel(x0 + 20, clean)} fill="none" stroke={SKY} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <rect x={x0 + 20} y="170" width="200" height="60" fill={SKY} opacity="0.18" />
            {/* beach on the right */}
            <path d={`M${x0 + 222} 150 L${x0 + 300} 190 L${x0 + 300} 232 L${x0 + 222} 232 Z`} fill={SAND} stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
            {/* wind arrows: offshore blows from the beach to the sea (left), onshore the other way (right) */}
            {[60, 90].map((y) => (
              <g key={y}>
                <line className="draw" pathLength="1" x1={clean ? x0 + 290 : x0 + 40} y1={y} x2={clean ? x0 + 120 : x0 + 210} y2={y} stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
                <Head x={clean ? x0 + 112 : x0 + 218} y={y} angle={clean ? 180 : 0} />
              </g>
            ))}
            <text x={x0 + 160} y="262" textAnchor="middle" className="diagram-hand" fill={clean ? '#1f7a4a' : CORAL}>
              {clean ? 'offshore: clean and glassy' : 'onshore: bumpy and messy'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------- rip current seen from above
export function RipDiagram() {
  return (
    <svg viewBox="0 0 640 320" className="diagram-svg" role="img" aria-label="A rip current seen from above, flowing out through a gap in the breaking waves">
      {/* water (top) and sand (bottom) */}
      <rect x="0" y="0" width="640" height="320" fill={SKY} opacity="0.2" />
      <path d="M0 250 Q80 236 160 250 T320 250 T480 250 T640 250 V320 H0Z" fill={SAND} stroke={NAVY} strokeWidth="3" />
      <text x="320" y="296" textAnchor="middle" className="diagram-hand" fill={NAVY}>the beach</text>

      {/* breaking waves, with a gap in the middle where the rip flows out */}
      <path className="draw" pathLength="1" d="M10 160 Q60 140 110 160 T250 160" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
      <path className="draw" pathLength="1" d="M390 160 Q440 140 490 160 T630 160" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
      <path d="M10 160 Q60 140 110 160 T250 160 M390 160 Q440 140 490 160 T630 160" fill="none" stroke={SKY} strokeWidth="3" strokeLinecap="round" />

      {/* water pushed toward the beach on both sides */}
      {[110, 520].map((x) => (
        <g key={x}>
          <line className="draw" pathLength="1" x1={x} y1="190" x2={x} y2="235" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
          <Head x={x} y={238} angle={90} />
        </g>
      ))}
      <text x="110" y="120" textAnchor="middle" className="diagram-hand" fill={NAVY}>waves push water in</text>

      {/* the rip: water coming back out through the gap */}
      <path className="draw" pathLength="1" d="M320 230 C 300 200, 340 170, 320 120 C 310 90, 320 60, 320 40" fill="none" stroke={CORAL} strokeWidth="12" strokeLinecap="round" />
      <Head x={320} y={34} angle={-90} color={CORAL} />
      <text x="360" y="90" className="diagram-hand" fill={CORAL}>the rip: the fast way out</text>

      {/* the escape route: swim sideways */}
      <line className="draw" pathLength="1" x1="332" y1="206" x2="440" y2="206" stroke="#1f7a4a" strokeWidth="4" strokeLinecap="round" strokeDasharray="1" />
      <Head x={444} y={206} angle={0} color="#1f7a4a" />
      <text x="452" y="196" className="diagram-hand" fill="#1f7a4a">swim sideways</text>
    </svg>
  );
}

// lookup used by the chapter component: data says "wave", we show wavediagram
export const diagrams = { wave: WaveDiagram, wind: WindDiagram, rip: RipDiagram };
