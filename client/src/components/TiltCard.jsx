// a card that tilts toward your mouse in 3d (idea from react-bits tiltedcard).
import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

export default function TiltCard({ children, className = '', max = 8 }) {
  const card = useRef(null);

  const handleMove = (e) => {
    if (prefersReducedMotion()) return;
    const box = card.current.getBoundingClientRect();
    // where is the mouse inside the card, from -0.5 (left/top) to +0.5 (right/bottom)?
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    gsap.to(card.current, { rotationY: x * max * 2, rotationX: -y * max * 2, transformPerspective: 700, duration: 0.35, ease: 'power2.out' });
  };

  // when the mouse leaves, settle back flat
  const handleLeave = () => {
    gsap.to(card.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <div ref={card} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}
