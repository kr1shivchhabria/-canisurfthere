// a number that counts up (or down) to a new value.
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

export default function CountUp({ to, duration = 1.6 }) {
  const ref = useRef(null);
  const current = useRef(0); // remembers the number we are showing right now

  useEffect(() => {
    if (to == null) return;
    if (prefersReducedMotion()) {
      ref.current.textContent = to;
      current.current = to;
      return;
    }
    // gsap animates a plain object, and we copy its value into the page on every frame
    const counter = { value: current.current };
    const tween = gsap.to(counter, {
      value: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        current.current = counter.value;
        if (ref.current) ref.current.textContent = Math.round(counter.value);
      },
    });
    return () => tween.kill();
  }, [to, duration]);

  return <span ref={ref}>0</span>;
}
