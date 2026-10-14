// one place to set up gsap, so every file imports it the same way.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// scrolltrigger is a gsap plugin, it has to be registered once
gsap.registerPlugin(ScrollTrigger);

// some people turn off animations in their system settings. we respect that.
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };
