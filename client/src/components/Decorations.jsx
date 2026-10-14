// decorations.jsx
// little hand-drawn beach things that sit around the big button.
// every drawing is an svg, so it stays sharp at any size and we can animate it with css.
// all of them share a dark blue outline so they look like they belong together.

const OUTLINE = '#072f4d'; // the dark blue outline color
const CORAL = '#ef6f5e';
const SUN = '#f6c84c';
const SKY = '#4fb4ea';
const SAND = '#ecd9ad';
const SAND_DARK = '#c9a96b';

// ---------------------------------------------------------------- crab
export function Crab(props) {
  // one claw, drawn on the left. we flip it to make the right claw.
  const claw = (
    <g>
      <path d="M46 62 Q24 58 22 36" fill="none" stroke={OUTLINE} strokeWidth="10" strokeLinecap="round" />
      <path d="M46 62 Q24 58 22 36" fill="none" stroke={CORAL} strokeWidth="5" strokeLinecap="round" />
      <path d="M7 32 Q4 6 22 8 Q37 10 33 32 Q27 23 20 32 Q13 23 7 32Z" fill={CORAL} stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    </g>
  );
  // three legs on each side: [start x, start y, end x, end y]
  const legs = [[40, 80, 10, 88], [42, 88, 14, 102], [48, 94, 26, 110]];
  return (
    <svg viewBox="0 0 160 118" {...props}>
      {legs.map(([x1, y1, x2, y2], i) => (
        <g key={i} strokeLinecap="round">
          <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={OUTLINE} strokeWidth="9" />
          <path d={`M${160 - x1} ${y1} L${160 - x2} ${y2}`} stroke={OUTLINE} strokeWidth="9" />
          <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={CORAL} strokeWidth="4.5" />
          <path d={`M${160 - x1} ${y1} L${160 - x2} ${y2}`} stroke={CORAL} strokeWidth="4.5" />
        </g>
      ))}
      <g className="claw-left">{claw}</g>
      <g transform="translate(160 0) scale(-1 1)" className="claw-right">{claw}</g>
      {/* eye stalks */}
      <path d="M68 50 L66 32 M92 50 L94 32" stroke={OUTLINE} strokeWidth="5" strokeLinecap="round" />
      <circle cx="66" cy="29" r="9" fill="#fff" stroke={OUTLINE} strokeWidth="3.5" />
      <circle cx="94" cy="29" r="9" fill="#fff" stroke={OUTLINE} strokeWidth="3.5" />
      <circle cx="67" cy="30" r="3.6" fill={OUTLINE} />
      <circle cx="93" cy="30" r="3.6" fill={OUTLINE} />
      {/* body */}
      <ellipse cx="80" cy="72" rx="44" ry="30" fill={CORAL} stroke={OUTLINE} strokeWidth="4" />
      <ellipse cx="68" cy="62" rx="20" ry="9" fill="#fff" opacity="0.28" />
      <path d="M68 82 Q80 92 92 82" fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
      <circle cx="58" cy="76" r="3" fill="#c94a3b" />
      <circle cx="102" cy="76" r="3" fill="#c94a3b" />
    </svg>
  );
}

// ---------------------------------------------------------------- beach ball
export function BeachBall(props) {
  const colors = [SKY, '#ffffff', CORAL, '#ffffff', SUN, '#ffffff'];
  // each slice is a piece of the circle, 60 degrees wide. we work out its corners with sin and cos.
  const slices = colors.map((color, i) => {
    const a1 = (i * 60 - 90) * (Math.PI / 180);
    const a2 = ((i + 1) * 60 - 90) * (Math.PI / 180);
    const r = 54;
    const x1 = 60 + r * Math.cos(a1);
    const y1 = 60 + r * Math.sin(a1);
    const x2 = 60 + r * Math.cos(a2);
    const y2 = 60 + r * Math.sin(a2);
    return <path key={i} d={`M60 60 L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={color} />;
  });
  return (
    <svg viewBox="0 0 120 120" {...props}>
      {slices}
      <circle cx="60" cy="60" r="54" fill="none" stroke={OUTLINE} strokeWidth="4" />
      {/* shine */}
      <path d="M26 40 Q34 24 52 18" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      {/* the little cap in the middle */}
      <circle cx="60" cy="60" r="7" fill="#fff" stroke={OUTLINE} strokeWidth="3" />
    </svg>
  );
}

// ---------------------------------------------------------------- sandcastle
export function Sandcastle(props) {
  // a row of little blocks along the top of a wall (the "teeth" of a castle)
  const teeth = (x, y, width, count) => {
    const size = width / (count * 2 - 1);
    return Array.from({ length: count }, (_, i) => (
      <rect key={`${x}-${i}`} x={x + i * size * 2} y={y - size * 1.1} width={size} height={size * 1.2} fill={SAND} stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    ));
  };
  return (
    <svg viewBox="0 0 240 210" {...props}>
      {/* the mound of sand it sits on */}
      <ellipse cx="120" cy="190" rx="112" ry="16" fill={SAND_DARK} stroke={OUTLINE} strokeWidth="3" />
      {/* back wall */}
      <rect x="30" y="116" width="180" height="72" fill={SAND} stroke={OUTLINE} strokeWidth="4" />
      {teeth(30, 116, 180, 6)}
      {/* left and right towers */}
      <rect x="12" y="84" width="48" height="104" fill={SAND} stroke={OUTLINE} strokeWidth="4" />
      {teeth(12, 84, 48, 3)}
      <rect x="180" y="84" width="48" height="104" fill={SAND} stroke={OUTLINE} strokeWidth="4" />
      {teeth(180, 84, 48, 3)}
      {/* tall middle tower */}
      <rect x="84" y="48" width="72" height="140" fill={SAND} stroke={OUTLINE} strokeWidth="4" />
      {teeth(84, 48, 72, 4)}
      {/* shadows on the right side of each tower */}
      <rect x="44" y="84" width="16" height="104" fill={SAND_DARK} opacity="0.55" />
      <rect x="212" y="84" width="16" height="104" fill={SAND_DARK} opacity="0.55" />
      <rect x="138" y="48" width="18" height="140" fill={SAND_DARK} opacity="0.55" />
      {/* door and windows */}
      <path d="M102 188 L102 150 Q120 128 138 150 L138 188 Z" fill={SAND_DARK} stroke={OUTLINE} strokeWidth="4" />
      <rect x="112" y="78" width="16" height="24" rx="8" fill={SAND_DARK} stroke={OUTLINE} strokeWidth="3" />
      <rect x="29" y="112" width="14" height="22" rx="7" fill={SAND_DARK} stroke={OUTLINE} strokeWidth="3" />
      <rect x="197" y="112" width="14" height="22" rx="7" fill={SAND_DARK} stroke={OUTLINE} strokeWidth="3" />
      {/* flag on the middle tower (the flag part waves in css) */}
      <path d="M120 40 L120 6" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
      <path className="flag" d="M122 8 L152 17 L122 28 Z" fill={CORAL} stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
      {/* speckles so it feels like real sand */}
      {[[50, 160], [70, 140], [190, 170], [160, 130], [34, 176], [124, 98], [100, 72], [214, 150]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={SAND_DARK} />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------- starfish
export function Starfish(props) {
  // a five-pointed star: points alternate between a far corner and a near corner
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? 46 : 21;
    const angle = (i * 36 - 90) * (Math.PI / 180);
    return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 100" {...props}>
      {/* the thick rounded outline, then the fill on top */}
      <polygon points={points} fill="#f39a5a" stroke={OUTLINE} strokeWidth="11" strokeLinejoin="round" />
      <polygon points={points} fill="#f39a5a" stroke="#f39a5a" strokeWidth="4" strokeLinejoin="round" />
      {/* little bumps down each arm */}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        return [14, 26, 37].map((d) => (
          <circle key={`${i}-${d}`} cx={50 + d * Math.cos(angle)} cy={50 + d * Math.sin(angle)} r="2.4" fill="#fde1c4" />
        ));
      })}
    </svg>
  );
}

// ---------------------------------------------------------------- shells
export function Scallop(props) {
  // ridges fan out from the bottom point of the shell
  const ridges = [-52, -34, -17, 0, 17, 34, 52].map((deg, i) => {
    const a = (deg - 90) * (Math.PI / 180);
    return <line key={i} x1="50" y1="78" x2={50 + 58 * Math.cos(a)} y2={78 + 58 * Math.sin(a)} stroke="#d99a7a" strokeWidth="3" strokeLinecap="round" />;
  });
  return (
    <svg viewBox="0 0 100 90" {...props}>
      <path d="M50 80 L10 42 Q6 10 50 8 Q94 10 90 42 Z" fill="#fbe0cc" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
      {ridges}
      <path d="M38 84 L62 84 L58 74 L42 74 Z" fill="#fbe0cc" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  );
}

export function SpiralShell(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path d="M14 70 Q10 40 40 24 Q76 10 88 44 Q96 74 62 84 Q30 92 14 70 Z" fill="#f7e8cc" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
      {/* the swirl inside */}
      <path d="M54 52 Q64 46 66 56 Q66 70 50 70 Q32 68 34 50 Q38 32 58 34 Q78 38 76 58" fill="none" stroke="#c9a06a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 62 Q26 50 34 44" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

// ---------------------------------------------------------------- surfboard stuck in the sand
export function Surfboard(props) {
  return (
    <svg viewBox="0 0 80 280" {...props}>
      {/* board */}
      <path d="M40 6 C64 44 68 140 60 238 L20 238 C12 140 16 44 40 6 Z" fill={SKY} stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
      {/* stripes */}
      <path d="M26 120 C34 126 46 126 54 120 L55 138 C46 144 34 144 25 138 Z" fill="#fff" />
      <path d="M24 150 C34 156 46 156 56 150 L56 164 C46 170 34 170 24 164 Z" fill={SUN} />
      {/* the line down the middle and a shine */}
      <line x1="40" y1="30" x2="40" y2="238" stroke="#fff" strokeWidth="3" opacity="0.8" />
      <path d="M26 70 Q24 110 26 150" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      {/* the sand pile at the bottom hides the end of the board */}
      <path d="M0 270 Q10 236 40 232 Q70 236 80 270 Z" fill={SAND_DARK} stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------- beach umbrella
export function Umbrella(props) {
  // the umbrella has 5 stripes. each stripe is one "gore" between two points on the rim
  const rim = [14, 49, 84, 119, 154, 186]; // x positions along the bottom edge
  const stripes = rim.slice(0, -1).map((x, i) => {
    const next = rim[i + 1];
    return (
      <path key={i} d={`M100 12 Q${x - 6} 40 ${x} 100 Q${(x + next) / 2} 112 ${next} 100 Q${next + 6} 40 100 12 Z`} fill={i % 2 === 0 ? CORAL : '#ffffff'} />
    );
  });
  return (
    <svg viewBox="0 0 200 220" {...props}>
      {/* the pole */}
      <line x1="100" y1="12" x2="100" y2="212" stroke={OUTLINE} strokeWidth="10" strokeLinecap="round" />
      <line x1="100" y1="12" x2="100" y2="212" stroke="#d9b98a" strokeWidth="5" strokeLinecap="round" />
      {stripes}
      {/* outline of the whole canopy */}
      <path d="M12 100 Q16 18 100 10 Q184 18 188 100 Q171 112 154 100 Q137 112 119 100 Q102 112 84 100 Q67 112 49 100 Q30 112 12 100 Z" fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="100" cy="10" r="5" fill={SUN} stroke={OUTLINE} strokeWidth="3" />
    </svg>
  );
}

// ---------------------------------------------------------------- bucket and shovel
export function Bucket(props) {
  return (
    <svg viewBox="0 0 130 110" {...props}>
      {/* shovel leaning on the bucket */}
      <path d="M96 12 L112 84" stroke={OUTLINE} strokeWidth="9" strokeLinecap="round" />
      <path d="M96 12 L112 84" stroke={SKY} strokeWidth="4" strokeLinecap="round" />
      <path d="M104 70 L128 66 L124 100 L110 100 Z" fill={SKY} stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
      {/* handle */}
      <path d="M22 40 Q60 -6 98 40" fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
      {/* the bucket */}
      <path d="M14 40 L100 40 L88 100 L26 100 Z" fill={SUN} stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
      <rect x="10" y="34" width="94" height="12" rx="6" fill="#f0b92e" stroke={OUTLINE} strokeWidth="4" />
      {/* a little wave pattern on the side */}
      <path d="M24 66 Q34 56 44 66 T64 66 T84 66" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M26 82 Q36 72 46 82 T66 82 T84 82" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ---------------------------------------------------------------- beach towel
export function Towel(props) {
  return (
    <svg viewBox="0 0 200 134" {...props}>
      <g transform="skewX(-8) translate(14 0)">
        {/* fringe along the bottom edge */}
        <g stroke={OUTLINE} strokeWidth="3" strokeLinecap="round">
          {[24, 46, 68, 90, 112, 134, 156, 178].map((x) => <line key={x} x1={x} y1="118" x2={x} y2="130" />)}
        </g>
        <rect x="10" y="8" width="180" height="112" rx="6" fill="#fff" stroke={OUTLINE} strokeWidth="4" />
        {/* stripes */}
        <rect x="14" y="30" width="172" height="14" fill={SKY} />
        <rect x="14" y="52" width="172" height="8" fill={CORAL} />
        <rect x="14" y="70" width="172" height="14" fill={SKY} />
        <rect x="14" y="92" width="172" height="8" fill={SUN} />
        <rect x="14" y="12" width="172" height="5" fill="#fff" opacity="0.6" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- flip-flops
export function Flipflops(props) {
  // one sandal, drawn around (0,0) so we can place and tilt each one
  const sandal = (
    <g>
      <ellipse cx="0" cy="0" rx="21" ry="42" fill={CORAL} stroke={OUTLINE} strokeWidth="4" />
      <ellipse cx="0" cy="2" rx="14" ry="33" fill="#f58f80" />
      {/* the strap */}
      <path d="M-12 -2 Q0 -28 12 -2" fill="none" stroke={OUTLINE} strokeWidth="9" strokeLinecap="round" />
      <path d="M-12 -2 Q0 -28 12 -2" fill="none" stroke={SUN} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="0" cy="-14" r="3.5" fill={OUTLINE} />
    </g>
  );
  return (
    <svg viewBox="0 0 140 112" {...props}>
      <g transform="translate(40 58) rotate(-12)">{sandal}</g>
      <g transform="translate(98 52) rotate(8)">{sandal}</g>
    </svg>
  );
}

// ---------------------------------------------------------------- a hand-drawn curly arrow (points up and to the right)
export function CurlyArrow(props) {
  return (
    <svg viewBox="0 0 90 80" fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path className="arrow-line" d="M8 70 C 4 40, 30 44, 36 30 C 42 14, 60 14, 72 12" />
      <path className="arrow-line" d="M58 2 L74 12 L60 24" />
    </svg>
  );
}

// ---------------------------------------------------------------- seagull (a simple "v" shape with curved wings)
export function Gull(props) {
  return (
    <svg viewBox="0 0 60 28" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 18 Q14 2 30 16 Q46 2 57 18" />
    </svg>
  );
}

// ---------------------------------------------------------------- a little surfer riding a wave (used on the field guide section)
export function Surfer(props) {
  return (
    <svg viewBox="0 0 150 100" {...props}>
      {/* the wave: a dark body, a lighter face and a white foam lip on top */}
      <path d="M0 100 L0 78 Q30 74 56 58 Q82 42 108 52 Q128 60 150 72 L150 100 Z" fill="#1f85c4" />
      <path d="M0 100 L0 88 Q36 86 62 72 Q88 58 114 68 Q132 75 150 82 L150 100 Z" fill="#4fb4ea" />
      <path d="M56 58 Q82 42 108 52" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="64" r="2.6" fill="#fff" />
      <circle cx="40" cy="70" r="2" fill="#fff" />
      <circle cx="116" cy="58" r="2.2" fill="#fff" />
      {/* the board, tilted along the face of the wave */}
      <g transform="rotate(-14 80 53)">
        <ellipse cx="80" cy="53" rx="31" ry="4.6" fill={SUN} stroke={OUTLINE} strokeWidth="2.5" />
        <path d="M62 52 Q80 49 98 52" fill="none" stroke={CORAL} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* the surfer: bent legs, leaning body, arms out for balance, and a head */}
      <g stroke={OUTLINE} strokeLinecap="round" fill="none">
        <path d="M73 49 L79 33 M89 48 L80 33" strokeWidth="5" />
        <path d="M80 33 L88 18" strokeWidth="7" />
        <path d="M88 20 L108 25 M87 21 L66 22" strokeWidth="3.6" />
      </g>
      <circle cx="92" cy="10" r="6.6" fill={OUTLINE} />
    </svg>
  );
}

// ---------------------------------------------------------------- the wrapper that places a decoration on the sand
const art = {
  crab: Crab,
  ball: BeachBall,
  castle: Sandcastle,
  star: Starfish,
  scallop: Scallop,
  spiral: SpiralShell,
  board: Surfboard,
  umbrella: Umbrella,
  bucket: Bucket,
  towel: Towel,
  flipflops: Flipflops,
};

// three nested divs on purpose, because each one gets a different kind of motion:
//   .deco       moves with the mouse (parallax, set by gsap)
//   .deco-pop   pops in when you scroll to it (gsap)
//   .deco-idle  keeps moving on its own, like the crab scuttling (css keyframes)
export default function Deco({ name, depth = 1, style, className = '', rotate = 0, delay = 0 }) {
  const Art = art[name];
  return (
    <div className={`deco ${className}`} style={style} data-depth={depth} aria-hidden="true">
      <div className="deco-pop">
        <div className={`deco-idle idle-${name}`} style={{ animationDelay: `${delay}s` }}>
          <Art style={{ transform: `rotate(${rotate}deg)` }} />
        </div>
      </div>
    </div>
  );
}
