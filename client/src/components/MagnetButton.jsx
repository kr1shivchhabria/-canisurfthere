// wraps anything so it gets pulled toward the mouse a little (magnet effect).
import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

export default function MagnetButton({ children, strength = 0.25 }) {
  const outer = useRef(null); // stays still, listens for the mouse
  const inner = useRef(null); // this one moves

  const handleMove = (e) => {
    if (prefersReducedMotion()) return;
    const box = outer.current.getBoundingClientRect();
    // how far is the mouse from the center of the button?
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    gsap.to(inner.current, { x: dx * strength, y: dy * strength, duration: 0.4, ease: 'power3.out' });
  };

  // when the mouse leaves, spring back to the middle
  const handleLeave = () => {
    gsap.to(inner.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <div ref={outer} className="magnet" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
