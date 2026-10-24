import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Values mirror the design-system motion tokens (tokens/effects.css):
// --dur-reveal 900ms, --ease-soft cubic-bezier(.22,.61,.36,1), --reveal-distance 16px.
// TODO(Taylor): STAGGER and TRIGGER_START set how the page "breathes" as you scroll.
const DURATION = 0.9;
const STAGGER = 0.15;
const TRIGGER_START = 'top 88%';

CustomEase.create('soft', '.22,.61,.36,1');

/** Fade-and-rise reveal for every `[data-reveal]` element. Skipped for reduced motion. */
export function initReveal(): void {
  // Pages swap without a reload, so clear triggers left over from the previous page.
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.batch('[data-reveal]', {
    start: TRIGGER_START,
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: DURATION, stagger: STAGGER, ease: 'soft', overwrite: true }),
  });
  // Photos marked `reveal` unveil from the bottom up: calm, no zoom (design system rule).
  ScrollTrigger.batch('[data-reveal-photo]', {
    start: TRIGGER_START,
    once: true,
    onEnter: (els) =>
      gsap.to(els, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, stagger: STAGGER, ease: 'soft', overwrite: true }),
  });
}
