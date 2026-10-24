import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Values mirror the design-system motion tokens (tokens/effects.css):
// --dur-reveal 450ms, --ease-soft cubic-bezier(.22,.61,.36,1). Reveals are fades only, no movement.
// TODO(Taylor): STAGGER and TRIGGER_START set how the page "breathes" as you scroll.
const DURATION = 0.45;
const STAGGER = 0.06;
const TRIGGER_START = 'top 92%';

CustomEase.create('soft', '.22,.61,.36,1');

// Photos never animate: inside a `[data-reveal]` block, fade only the largest parts that hold no image.
// Keep in sync with the hidden-state rule in styles/global.css.
const REVEAL = '[data-reveal]:not(:has(img)), :is([data-reveal], [data-reveal] *):has(img) > :not(:has(img), img)';

/** Quick fade-in for the photo-free parts of every `[data-reveal]` block. Skipped for reduced motion. */
export function initReveal(): void {
  // Pages swap without a reload, so clear triggers left over from the previous page.
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.batch(REVEAL, {
    start: TRIGGER_START,
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, duration: DURATION, stagger: STAGGER, ease: 'soft', overwrite: true }),
  });
}
