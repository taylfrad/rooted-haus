# Launch runbook (when the site is ready to go public)

The site is hosted on GitHub Pages. Until a custom domain is connected it lives at
`https://<account>.github.io/rooted-haus/` and is hidden from search engines (staging mode). The deploy workflow asks
GitHub for the site's real address on every build, so moving the repository and connecting the domain need no code
changes; staging mode turns off by itself once the domain is live.

## Hand the repository to the owner

1. **Her GitHub account.** She creates a free account (with two-factor sign-in on). The repository is public, so
   GitHub Pages works on the free plan.
2. **Transfer.** Current owner: repository Settings > General > Danger Zone > Transfer ownership, to her username.
   She accepts from the email GitHub sends.
3. **Keep helping.** She adds you back: Settings > Collaborators > Add people (Write access is enough to push).
4. **Pages after the move.** Settings > Pages: Source should still say "GitHub Actions". Run the deploy once
   (Actions > Deploy staging to GitHub Pages > Run workflow). The new staging address is
   `https://<her-username>.github.io/rooted-haus/`; expect the old address to stop working.
5. **Your local copy.** `git remote set-url origin https://github.com/<her-username>/rooted-haus.git`
6. **Editing panel.** She signs in at https://app.pagescms.org with her GitHub account and allows the Pages CMS app on
   the repository when asked. Her panel link becomes `https://app.pagescms.org/<her-username>/rooted-haus/main`.
7. **Nightly rebuild.** The deploy also runs every night so dated deals start and end on time. GitHub pauses scheduled
   workflows in a repository with no activity for 60 days (panel saves count as activity); if deals stop updating,
   re-enable it under Actions.

## Go live

1. **Content is real.** Walk `content-checklist.md`; search the site for "Placeholder", "from $—", "Client name", "coming soon", "TODO".
2. **Boulevard overlay.** Paste the owner's snippet at the marked TODO in `web/src/layouts/BaseLayout.astro`. Test: every "Book" button opens booking on top of the site; with the script blocked it opens the Boulevard page.
3. **Forms.** Put the form service address in the panel (Studio details, Contact form address). For resume uploads, also set the Job application form address to a service that accepts files (see `docs/forms.md`). Send a test from Contact, Careers (once with a PDF, once without) and the newsletter box.
4. **Domain.** The owner registers rootedhaus.com in her own account (backup: therootedhaus.com). At her domain
   registrar, add these DNS records:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` record for `www`: `<her-username>.github.io`
5. **Protect the domain.** In her GitHub account (not the repository): Settings > Pages > Add a domain, then add the
   `TXT` record it shows. This stops anyone else's repository from claiming the domain.
6. **Connect it.** Repository Settings > Pages > Custom domain: `rootedhaus.com`. When the DNS check passes, tick
   "Enforce HTTPS" (the certificate can take up to an hour). Then run the deploy once (Actions > Run workflow): the
   site rebuilds at the root of the domain and staging mode (the `noindex` tag and `/rooted-haus/` prefix) switches off.
7. **Old site.** Redirect rosesalonspa.com to the new domain if she controls it; otherwise ask the previous owner. Update the website link on her Google Business profile, Instagram bio and Boulevard profile.
8. **Check.** Lighthouse (performance, accessibility, SEO at least 90), phone-width pass on every page, submit `sitemap-index.xml` in Google Search Console.
