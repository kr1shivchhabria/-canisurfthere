// usedecomotion.js
// makes the decorations inside one section (1) pop in when you scroll to them
// and (2) drift a little with the mouse. things with a bigger "depth" number move more.
import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from './gsap';

export default function useDecoMotion(scope) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from('.deco-pop', {
        scale: 0,
        rotation: -30,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.8)',
        stagger: { each: 0.08, from: 'random' },
        scrollTrigger: { trigger: scope.current, start: 'top 70%' },
      });
    }, scope);

    const movers = gsap.utils.toArray('.deco', scope.current).map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
      depth: parseFloat(el.dataset.depth),
    }));
    const handleMouse = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(-nx * m.depth * 40);
        m.y(-ny * m.depth * 26);
      });
    };
    window.addEventListener('mousemove', handleMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      ctx.revert();
    };
  }, [scope]);
}
