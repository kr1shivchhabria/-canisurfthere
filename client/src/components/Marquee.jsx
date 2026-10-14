// a strip of words that slides sideways forever, and speeds up when you scroll fast.
// (idea from the scroll velocity component in react-bits)
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

export default function Marquee({ words, className = '' }) {
  const track = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // the track holds the words twice, so sliding left by 50% looks like an endless loop
    const slide = gsap.to(track.current, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });

    // when you scroll fast, speed up the slide. scrolltrigger can tell us how fast you are scrolling
    const trigger = ScrollTrigger.create({
      onUpdate: (self) => slide.timeScale(1 + Math.min(8, Math.abs(self.getVelocity()) / 200)),
    });
    // every frame, ease the speed back to normal
    const settle = () => slide.timeScale(slide.timeScale() + (1 - slide.timeScale()) * 0.05);
    gsap.ticker.add(settle);

    return () => {
      gsap.ticker.remove(settle);
      trigger.kill();
      slide.kill();
    };
  }, []);

  const row = words.map((word, i) => (
    <span key={i} className="marquee-item">
      {word}
      <span className="marquee-dot" aria-hidden="true">✦</span>
    </span>
  ));

  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-track" ref={track}>
        {row}
        {row}
      </div>
    </div>
  );
}
