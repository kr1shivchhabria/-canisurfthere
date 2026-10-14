// smooth scrolling with lenis, connected to gsap scrolltrigger.
// call this hook once on any page that should scroll smoothly.
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

export default function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return; // normal scrolling for people who asked for less motion

    const lenis = new Lenis({ lerp: 0.1 }); // lower lerp = floatier scroll

    // every time lenis scrolls, tell scrolltrigger so animations stay in sync
    lenis.on('scroll', ScrollTrigger.update);

    // let gsap's clock drive lenis (gsap time is in seconds, lenis wants milliseconds)
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // clean up when we leave the page
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
