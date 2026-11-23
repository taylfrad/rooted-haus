// Handwritten phrases stay on one line: a phrase broken across lines ("come grow with / us") stops reading as one
// gesture. Every phrase set in the script is marked `data-fit` (the closings, the line above a heading, the phrase
// inside a heading, the small cards). It keeps its designed size whenever it fits the width of its parent, and shrinks
// just enough when it does not (a wide screen where the phrase outgrows its column, or a phone). The phrases are edited
// in the panel, so their length is not known ahead of time. Without JavaScript the phrase wraps at its designed size.
// (The Home slideshow fits its phrases itself: they share one spot, so they shrink together.)

// TODO(Taylor): the smallest the handwriting may get to stay on one line. A phrase that would need to be smaller than
// this (a long one on a narrow phone) wraps onto a second line at this size instead. Lower keeps one line on more
// phones; higher keeps long phrases legible. "unhurried · intentional · yours" needs 27px on a 375px phone, 22px on 320px.
const MIN_FIT_PX = 20;

/** The width of an element's text set on one line, in px. */
function textWidth(el: HTMLElement): number {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
}

/** The room inside an element: its width without padding. */
function contentWidth(el: HTMLElement): number {
  const s = getComputedStyle(el);
  return el.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
}

function fit(el: HTMLElement): void {
  const parent = el.parentElement;
  if (!parent) return;
  // 1. Measure the room with the phrase allowed to wrap, at its designed size. The order matters: a phrase that may not
  //    wrap counts as one unbreakable piece, and grid columns and flex items grow to hold it, so measured that way the
  //    parent was always exactly as wide as the phrase (and the phrase ran off a phone screen, column and all).
  el.style.removeProperty('font-size');
  el.style.whiteSpace = 'normal';
  el.dataset.fit = '';
  const room = contentWidth(parent);
  // 2. Then set it on one line and see how wide it is.
  el.style.whiteSpace = 'nowrap';
  const width = textWidth(el);
  if (width <= room) return; // fits at its designed size
  // 3. Too wide: shrink it to the room (rounded down to a tenth of a pixel, so it is never a hair too wide)...
  const natural = parseFloat(getComputedStyle(el).fontSize);
  const size = Math.floor(((natural * room) / width) * 10) / 10;
  if (size >= MIN_FIT_PX) {
    el.style.fontSize = `${size}px`;
    return;
  }
  // ...unless that would make it too small to read: then it wraps after all, at the smallest size.
  el.style.fontSize = `${MIN_FIT_PX}px`;
  el.style.whiteSpace = 'normal';
  el.dataset.fit = 'wrap';
}

const fitAll = () => document.querySelectorAll<HTMLElement>('[data-fit]').forEach(fit);

/** Fit every `[data-fit]` phrase on the page; again once the handwriting font has loaded. */
export function initFit(): void {
  fitAll();
  document.fonts?.ready.then(fitAll);
}

// The width available changes only with the window; measure again once resizing pauses.
let wait: number | undefined;
window.addEventListener('resize', () => {
  window.clearTimeout(wait);
  wait = window.setTimeout(fitAll, 150);
});
