// story.jsx
// the "why i built this" part. it sits on the same sand as the button screen.
// no text animation and no scroll hold here on purpose, just clean readable words.
// the words come from data/sitetext.js. the decorations around it are the list below.
import { useRef } from 'react';
import Deco from './Decorations.jsx';
import useDecoMotion from '../lib/useDecoMotion';
import { siteText } from '../data/siteText';

const story = siteText.landing.story;

// the beach things around the about me. position them with left/right/top/bottom (percent of this section).
// size = how big, depth = how much it drifts with the mouse, rotate = tilt, hidesmall = hide on phones.
const decorations = [
  // top band
  { name: 'towel', style: { left: '2%', top: '-4%', width: 'clamp(100px, 12vw, 190px)' }, depth: 0.7, rotate: -8, hideSmall: true },
  { name: 'ball', style: { left: '41%', top: '3%', width: 'clamp(40px, 4.5vw, 72px)' }, depth: 1.5, rotate: 10 },
  { name: 'bucket', style: { right: '19%', top: '3%', width: 'clamp(54px, 6.5vw, 104px)' }, depth: 1.1, rotate: -8, hideSmall: true },
  { name: 'umbrella', style: { right: '3%', top: '1.5%', width: 'clamp(90px, 11vw, 180px)' }, depth: 0.5, rotate: 8, hideSmall: true },
  // bottom band
  { name: 'crab', style: { left: '4%', bottom: '2.5%', width: 'clamp(56px, 7vw, 112px)' }, depth: 1.3 },
  { name: 'flipflops', style: { left: '22%', bottom: '2%', width: 'clamp(52px, 6vw, 96px)' }, depth: 1.2, rotate: 10, hideSmall: true },
  { name: 'spiral', style: { left: '47%', bottom: '4%', width: 'clamp(30px, 3.5vw, 54px)' }, depth: 1.4, rotate: 24, hideSmall: true },
  { name: 'crab', style: { right: '41%', bottom: '1.5%', width: 'clamp(46px, 5.5vw, 88px)' }, depth: 1.6, delay: 1, hideSmall: true },
  { name: 'scallop', style: { right: '30%', bottom: '3.5%', width: 'clamp(36px, 4.2vw, 66px)' }, depth: 1.2, rotate: -16 },
  { name: 'star', style: { right: '9%', bottom: '4%', width: 'clamp(36px, 4.2vw, 68px)' }, depth: 1.4, rotate: 22 },
  // side margins
  { name: 'board', style: { right: '1.5%', top: '36%', width: 'clamp(40px, 4.6vw, 76px)' }, depth: 0.6, rotate: -6, hideSmall: true },
  { name: 'star', style: { left: '2%', top: '48%', width: 'clamp(32px, 3.6vw, 58px)' }, depth: 1.3, rotate: -20, hideSmall: true },
];

// a little postcard from la jolla, drawn with css and svg
function Postcard() {
  return (
    <figure className="postcard">
      <div className="postcard-picture">
        <svg viewBox="0 0 300 340" role="img" aria-label="Illustration of a sunny beach with waves">
          <defs>
            <linearGradient id="postSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7cc9f2" />
              <stop offset="1" stopColor="#d8effc" />
            </linearGradient>
          </defs>
          <rect width="300" height="340" fill="url(#postSky)" />
          {/* sun */}
          <circle cx="222" cy="62" r="26" fill="#f6c84c" />
          <circle cx="222" cy="62" r="38" fill="#f6c84c" opacity="0.25" />
          {/* everything below the sky slides down 150 so the picture is taller, like a polaroid */}
          <g transform="translate(0 150)">
          {/* cliffs, like the ones at torrey pines */}
          <path d="M0 110 L0 70 Q30 60 60 72 L96 66 L120 110 Z" fill="#c9a96b" />
          <path d="M0 110 L0 92 Q40 84 80 96 L120 110 Z" fill="#b8955a" />
          {/* sea layers */}
          <rect y="108" width="300" height="82" fill="#2790d1" />
          <path d="M0 126 Q25 116 50 126 T100 126 T150 126 T200 126 T250 126 T300 126 V190 H0Z" fill="#4fb4ea" />
          <path d="M0 148 Q25 138 50 148 T100 148 T150 148 T200 148 T250 148 T300 148 V190 H0Z" fill="#7cc9f2" />
          <path d="M0 170 Q25 160 50 170 T100 170 T150 170 T200 170 T250 170 T300 170 V190 H0Z" fill="#ecd9ad" />
          {/* a surfer on a wave */}
          <path d="M150 140 Q168 118 186 140" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="166" cy="116" r="5" fill="#072f4d" />
          <path d="M166 121 L164 134 M164 126 L156 130 M165 126 L174 122" stroke="#072f4d" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="164" cy="138" rx="16" ry="3" fill="#ef6f5e" />
          </g>
        </svg>
        <span className="postcard-stamp">{story.postcardStamp}</span>
      </div>
      <figcaption>
        <span className="postcard-title">{story.postcardTitle}</span>
        <span className="postcard-coords">{story.postcardCoords}</span>
      </figcaption>
    </figure>
  );
}

export default function Story() {
  const section = useRef(null);
  useDecoMotion(section); // the decorations pop in and drift with the mouse

  return (
    <section className="story" ref={section}>
      {/* beach things scattered around the about me */}
      {decorations.map((d, i) => (
        <Deco key={i} name={d.name} style={d.style} depth={d.depth} rotate={d.rotate} delay={d.delay} className={d.hideSmall ? 'hide-small' : ''} />
      ))}

      <div className="story-pin">
        <div className="story-text">
          <p className="hand story-hand">{story.note}</p>
          <h2 className="story-title">{story.title}</h2>
          <div className="story-body">
            {story.body.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </div>
        </div>
        <Postcard />
      </div>
    </section>
  );
}
