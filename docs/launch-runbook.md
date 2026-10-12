# Launch runbook (when the site is ready to go public)

Staging lives at https://taylfrad.github.io/rooted-haus/ and is hidden from search engines. Do these in order.

1. **Content is real.** Walk `content-checklist.md`; search the site for "Placeholder", "from $—", "Client name", "coming soon", "TODO".
2. **Boulevard overlay.** Paste the owner's snippet at the marked TODO in `web/src/layouts/BaseLayout.astro`. Test: every "Book" button opens booking on top of the site; with the script blocked it opens the Boulevard page.
3. **Forms.** Put the form service address in the panel (Studio details, Contact form address). For resume uploads, also set the Job application form address to a service that accepts files (see `docs/forms.md`). Send a test from Contact, Careers (once with a PDF, once without) and the newsletter box.
4. **Choose a host.** Any static host works (Cloudflare Pages, Netlify, or keep GitHub Pages with a custom domain). Build command `pnpm --filter web build`, output folder `web/dist`.
5. **Domain.** The owner registers rootedhaus.com in her own account. Point DNS at the host.
6. **Switch off staging mode.** Set the build variables `SITE_URL=https://rootedhaus.com` and leave `BASE_PATH` unset. Staging mode (the `noindex` tag and the `/rooted-haus/` prefix) turns off by itself.
7. **Old site.** Redirect rosesalonspa.com to the new domain if she controls it; otherwise ask the previous owner. Update the website link on her Google Business profile, Instagram bio and Boulevard profile.
8. **Check.** Lighthouse (performance, accessibility, SEO at least 90), phone-width pass on every page, submit `sitemap-index.xml` in Google Search Console.
