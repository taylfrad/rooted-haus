import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Values mirror the design-system motion tokens (tokens/effects.css): --dur-reveal 800ms, --ease-glide
// cubic-bezier(.16,1,.3,1), --rise-reveal 16px. Reveals fade in and rise a short way; photos never move.
// TODO(Taylor): these four set how the page "breathes" as you scroll. Keep DURATION in step with --dur-reveal
// (the starting offset itself lives in --rise-reveal, since CSS sets it before this script runs).
const DURATION = 0.8;
const STAGGER = 0.08;
const STAGGER_MAX = 0.32; // a long batch (a full menu of prices) still finishes promptly
const TRIGGER_START = 'top 88%';

CustomEase.create('glide', '.16,1,.3,1');

// Photos never animate: inside a `[data-reveal]` block, reveal only the largest parts that hold no image.
// Keep in sync with the hidden-state rule in styles/global.css.
const REVEAL = '[data-reveal]:not(:has(img)), :is([data-reveal], [data-reveal] *):has(img) > :not(:has(img), img)';

/** Fade-and-rise for the photo-free parts of every `[data-reveal]` block. Skipped for reduced motion. */
export function initReveal(): void {
  // Pages swap without a reload, so clear triggers left over from the previous page.
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.batch(REVEAL, {
    start: TRIGGER_START,
    once: true,
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        translate: '0px 0px',
        duration: DURATION,
        stagger: Math.min(STAGGER, STAGGER_MAX / Math.max(els.length - 1, 1)),
        ease: 'glide',
        overwrite: true,
      }),
  });
}
