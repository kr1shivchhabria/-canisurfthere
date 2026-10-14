// bubbles.jsx
// little bubbles that pop up out of the water, float up for a few seconds and fade away. pure css animation.
// they are short-lived on purpose: they only live in the thin band where the water meets the sand,
// and none of them hang around on the water.
// every bubble gets its own random size, speed, start time and sideways wobble.
//   count    = how many bubbles
//   duration = [shortest, longest] life of a bubble, in seconds
//   size     = [smallest, biggest] bubble, in pixels
import { useMemo } from 'react';

export default function Bubbles({ count = 40, className = '', duration = [3, 7], size = [6, 34] }) {
  // make the random numbers once, so the bubbles do not jump around when the page redraws
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const life = duration[0] + Math.random() * (duration[1] - duration[0]);
        return {
          left: Math.random() * 100, // percent from the left
          size: size[0] + Math.random() * (size[1] - size[0]),
          life,
          delay: -Math.random() * duration[1], // a negative delay means it is already part way up when the page loads
          sway: (Math.random() * 2 - 1) * 30, // how far it wobbles left or right (pixels)
          alpha: 0.55 + Math.random() * 0.4, // how see-through it is
        };
      }),
    [count] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={`bubbles ${className}`} aria-hidden="true">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.life}s`,
            animationDelay: `${b.delay}s`,
            '--sway': `${b.sway}px`,
            '--alpha': b.alpha,
          }}
        />
      ))}
    </div>
  );
}
