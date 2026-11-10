import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Reveals fade in and rise a short way; photos never move. The timings are read from the motion tokens in
// styles/tokens/effects.css, so that file is the one place to tune them:
//   --dur-reveal          how long one block takes to fade and rise
//   --stagger-reveal      the pause between blocks that arrive together
//   --stagger-reveal-max  the longest a whole batch may take to start (a full menu of prices still finishes promptly)
//   --rise-reveal         how far a block rises (CSS sets the starting offset before this script runs)
// TODO(Taylor): those four, plus TRIGGER_START below, set how the page "breathes" as you scroll.
const TRIGGER_START = 'top 88%'; // a block starts once its top is 88% of the way down the screen

/** A time token such as `--dur-reveal:800ms`, in seconds. */
function seconds(token: string, fallbackMs: number): number {
  const ms = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(token));
  return (Number.isFinite(ms) ? ms : fallbackMs) / 1000;
}

CustomEase.create('glide', '.16,1,.3,1');

// Photos never animate: inside a `[data-reveal]` block, reveal only the largest parts that hold no image.
// Keep in sync with the hidden-state rule in styles/global.css.
const REVEAL = '[data-reveal]:not(:has(img)), :is([data-reveal], [data-reveal] *):has(img) > :not(:has(img), img)';

/** Photos that are still loading start clear and fade in when they arrive. Ones already loaded are left alone. */
export function initPhotoFade(): void {
  document.querySelectorAll<HTMLImageElement>('img.pf__img, img.wide').forEach((img) => {
    if (img.complete) return;
    img.classList.add('is-loading');
    const show = () => img.classList.remove('is-loading');
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true }); // a missing photo shows its alt text rather than nothing
  });
}

/** Fade-and-rise for the photo-free parts of every `[data-reveal]` block. Skipped for reduced motion. */
export function initReveal(): void {
  // Pages swap without a reload, so clear triggers left over from the previous page.
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const duration = seconds('--dur-reveal', 800);
  const stagger = seconds('--stagger-reveal', 80);
  const staggerMax = seconds('--stagger-reveal-max', 320);
  ScrollTrigger.batch(REVEAL, {
    start: TRIGGER_START,
    once: true,
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        translate: '0px 0px',
        duration,
        stagger: Math.min(stagger, staggerMax / Math.max(els.length - 1, 1)),
        ease: 'glide',
        overwrite: true,
      }),
  });
}
