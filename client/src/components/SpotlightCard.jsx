// a card with a soft light that follows the mouse (idea from react-bits).
// the glow is drawn in landing.css using the --x and --y variables we set here.
import { useRef } from 'react';

export default function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const box = ref.current.getBoundingClientRect();
    // mouse position relative to the card
    ref.current.style.setProperty('--x', `${e.clientX - box.left}px`);
    ref.current.style.setProperty('--y', `${e.clientY - box.top}px`);
  };

  return (
    <div ref={ref} className={`spotlight ${className}`} onMouseMove={handleMove}>
      {children}
    </div>
  );
}
