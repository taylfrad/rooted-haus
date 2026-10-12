import type { APIRoute } from 'astro';
import { url } from '../lib/paths';
import { site } from '../lib/site';

export const GET: APIRoute = () => {
  const manifest = {
    name: `${site.name} · ${site.tagline}`,
    short_name: 'Rooted Haus',
    description: 'A holistic hair studio in Mandeville, Louisiana.',
    start_url: url(),
    scope: url(),
    display: 'browser',
    background_color: '#F3ECE2',
    theme_color: '#8C5637',
    icons: [
      { src: url('icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: url('icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: url('icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
};
