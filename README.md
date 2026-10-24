# The Rooted Haus

Website for **The Rooted Haus · Holistic Hair Studio** (Mandeville, LA). Booking happens on Boulevard; this site sends visitors there or to the gallery.

Built with [Astro](https://astro.build) (static output), self-hosted Fontsource fonts, Lucide icons, and GSAP for motion.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm check      # type-check
pnpm build      # static site in web/dist
```

Hosted on GitHub Pages. The deploy workflow asks GitHub for the site address, so it builds under `/rooted-haus/` (staging,
hidden from search) until a custom domain is connected, then at the domain root. Transfer and domain steps: `docs/launch-runbook.md`.
Any other host needs `SITE_URL` set (and `BASE_PATH` only when served under a sub-path).

## Layout

| Path | What |
|---|---|
| `web/` | The Astro site |
| `web/src/styles/tokens/` | Design tokens, copied from the design system project (see `docs/brand-rules.md`) |
| `web/src/content/` | Editable content (YAML/JSON), managed through the Pages CMS panel (`.pages.yml`) |
| `docs/` | Brand rules, content checklist for the owner, launch runbook |

## Brand rules in one breath

Never pure black or white. Pill buttons. Arch, circle and rounded photos. Gilda Display headlines, Montserrat body, Sacramento script accents. Gentle fade-ins only: no bounces, zooms or parallax.
