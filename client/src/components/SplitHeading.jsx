// a big title where every word rises into place and fades in, one after another.
// inspired by the split text effect from react-bits, rewritten small with gsap.
// we animate whole words (not single letters) because the title font is a script: its letters are joined
// together, and cutting a word into separate letters would break the joins.
//   underline  = words that get a thin wavy underline
//   emphasis   = words that are drawn in a lighter aqua
//   breakbeforelast = start the last word on a new line (so the title becomes two big lines)
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

export default function SplitHeading({ text, className = '', underline = [], emphasis = [], breakBeforeLast = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // gsap.context keeps the animation scoped to this heading and lets us clean up easily
    const ctx = gsap.context(() => {
      gsap.from('.split-piece', {
        y: 80, // start a little lower and glide up
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out', // a long, smooth slow-down at the end
        stagger: 0.22, // each word starts a little after the last one
        delay: 0.3,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const words = text.split(' ');

  return (
    // aria-label makes sure screen readers read the whole title
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={w} style={{ display: 'contents' }}>
          {/* an invisible full-width spacer pushes the last word onto its own line */}
          {breakBeforeLast && w === words.length - 1 && w > 0 && <span className="title-break" aria-hidden="true" />}
          <span
            className={`split-word ${underline.includes(word) ? 'underlined' : ''} ${emphasis.includes(word) ? 'emphasized' : ''}`}
            aria-hidden="true"
          >
            {/* the span that rises in (gsap) */}
            <span className="split-piece">{word}</span>
          </span>
        </span>
      ))}
    </h1>
  );
}
