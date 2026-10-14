// text that lights up word by word as you scroll (idea from react-bits scrollreveal).
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

// "trigger" is the element whose scroll position drives the animation.
// by default it is the paragraph itself, but for pinned sections we pass the whole section.
export default function ScrollReveal({ text, className = '', trigger, start = 'top 85%', end = 'bottom 55%' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sr-word',
        { opacity: 0.12, filter: 'blur(5px)' }, // dim and blurry...
        {
          opacity: 1,
          filter: 'blur(0px)', // ...to sharp and bright
          ease: 'none',
          stagger: 0.1, // one word after another
          scrollTrigger: { trigger: trigger || ref.current, start, end, scrub: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [trigger, start, end]);

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i}>
          <span className="sr-word">{word}</span>{' '}
        </span>
      ))}
    </p>
  );
}
