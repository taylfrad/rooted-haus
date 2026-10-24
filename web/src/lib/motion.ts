import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Values mirror the design-system motion tokens (tokens/effects.css):
// --dur-reveal 450ms, --ease-soft cubic-bezier(.22,.61,.36,1). Reveals are fades only, no movement.
// TODO(Taylor): STAGGER and TRIGGER_START set how the page "breathes" as you scroll.
const DURATION = 0.45;
const PHOTO_DURATION = 0.5;
const STAGGER = 0.06;
const TRIGGER_START = 'top 92%';

CustomEase.create('soft', '.22,.61,.36,1');

/** Quick fade-in for every `[data-reveal]` block and `[data-reveal-photo]` photo. Skipped for reduced motion. */
export function initReveal(): void {
  // Pages swap without a reload, so clear triggers left over from the previous page.
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.batch('[data-reveal]', {
    start: TRIGGER_START,
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, duration: DURATION, stagger: STAGGER, ease: 'soft', overwrite: true }),
  });
  // Wait for each photo to finish downloading before fading it in; otherwise the browser paints a
  // half-loaded image top to bottom during the fade, which reads as a roll instead of a fade.
  ScrollTrigger.batch('[data-reveal-photo]', {
    start: TRIGGER_START,
    once: true,
    onEnter: (els) =>
      els.forEach((el, i) => {
        const show = () =>
          gsap.to(el, { opacity: 1, duration: PHOTO_DURATION, delay: i * STAGGER, ease: 'soft', overwrite: true });
        const img = el.querySelector('img');
        if (!img || img.complete) show();
        else img.decode().catch(() => {}).then(show);
      }),
  });
}
