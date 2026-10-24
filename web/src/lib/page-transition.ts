import type { TransitionDirectionalAnimations } from 'astro';

// Page change for <main>: the old page fades out quickly, then the new one fades in and settles up into place
// (keyframes in styles/global.css). The header and footer stay put, so only the content changes.
// Same in both directions: back and forward should feel identical. Astro turns it off for reduced motion.
const pair = {
  old: { name: 'rh-page-out', duration: 'var(--dur-fast)', easing: 'ease-in', fillMode: 'both' },
  new: { name: 'rh-page-in', duration: 'var(--dur-page)', easing: 'var(--ease-glide)', delay: '60ms', fillMode: 'both' },
};

export const settle: TransitionDirectionalAnimations = { forwards: pair, backwards: pair };
