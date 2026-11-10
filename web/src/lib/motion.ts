// Scroll reveals and photo fades, with no animation library: the browser's own IntersectionObserver says when a
// block comes into view, and CSS transitions (styles/global.css) do the fading and rising on the compositor.
//
// Reveals fade in and rise a short way; photos never move. The timings are read from the motion tokens in
// styles/tokens/effects.css, so that file is the one place to tune them:
//   --dur-reveal          how long one block takes to fade and rise
//   --stagger-reveal      the pause between blocks that arrive together
//   --stagger-reveal-max  the longest a whole batch may take to start (a full menu of prices still finishes promptly)
//   --rise-reveal         how far a block rises (CSS sets the starting offset before this script runs)
// TODO(Taylor): those four, plus REVEAL_LINE below, set how the page "breathes" as you scroll.
const REVEAL_LINE = 12; // a block starts once its top is this many percent above the bottom of the screen

// Photos never animate: inside a `[data-reveal]` block, reveal only the largest parts that hold no image.
// Keep in sync with the hidden-state rule in styles/global.css.
const REVEAL = '[data-reveal]:not(:has(img)), :is([data-reveal], [data-reveal] *):has(img) > :not(:has(img), img)';

/** A time token such as `--dur-reveal:800ms`, in milliseconds. */
function ms(token: string, fallback: number): number {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(token));
  return Number.isFinite(value) ? value : fallback;
}

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

let observer: IntersectionObserver | undefined;

/** Fade-and-rise for the photo-free parts of every `[data-reveal]` block. Skipped for reduced motion. */
export function initReveal(): void {
  // Pages swap without a reload, so stop watching the previous page's blocks.
  observer?.disconnect();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const duration = ms('--dur-reveal', 800);
  const stagger = ms('--stagger-reveal', 80);
  const staggerMax = ms('--stagger-reveal-max', 320);

  const io = new IntersectionObserver(
    (entries) => {
      // Blocks already above the screen (a page opened part-way down) are shown too, so scrolling up finds them in place.
      const arriving = entries.filter((e) => e.isIntersecting || e.boundingClientRect.top < 0).map((e) => e.target as HTMLElement);
      const step = Math.min(stagger, staggerMax / Math.max(arriving.length - 1, 1));
      arriving.forEach((el, i) => {
        io.unobserve(el);
        const delay = i * step;
        el.style.setProperty('--reveal-delay', `${delay}ms`);
        el.classList.add('is-revealing');
        // Once it has arrived, hand the element back to its own styles, so its hover transitions are not delayed or replaced.
        window.setTimeout(() => {
          el.classList.replace('is-revealing', 'is-revealed');
          el.style.removeProperty('--reveal-delay');
        }, delay + duration + 50);
      });
    },
    { rootMargin: `0px 0px -${REVEAL_LINE}% 0px` },
  );
  document.querySelectorAll(REVEAL).forEach((el) => io.observe(el));
  observer = io;
}
