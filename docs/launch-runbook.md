# Launch runbook (when the site is ready to go public)

The site is hosted on Cloudflare Pages, connected to this GitHub repository. Every push to `main` (including saves
from the editing panel) builds and publishes https://rooted-haus.com within a few minutes. Other branches get their
own `*.pages.dev` preview address, which Cloudflare keeps out of search engines.

## Cloudflare Pages setup (one time)

1. **Project.** Cloudflare dashboard > Workers & Pages > Create > Pages > Import an existing Git repository. Connect
   GitHub, pick `rooted-haus`, production branch `main`.
2. **Build settings.** Framework preset: None. Build command: `pnpm --filter web check && pnpm --filter web build`.
   Build output directory: `web/dist`. Root directory: leave blank (the install runs at the repo root).
3. **Environment variables (Production).** `SITE_URL` = `https://rooted-haus.com`, `NODE_VERSION` = `24`,
   `PNPM_VERSION` = `10`. Leave `SITE_URL` out of Preview; previews use their own pages.dev address.
4. **Domain.** Project > Custom domains: add `rooted-haus.com`, then `www.rooted-haus.com`. Because the domain's DNS
   is already on Cloudflare, the records and HTTPS certificate are created automatically.
5. **One address.** On the rooted-haus.com zone: Rules > Redirect Rules > new rule, hostname equals
   `www.rooted-haus.com`, dynamic redirect to `concat("https://rooted-haus.com", http.request.uri.path)`, 301,
   preserve query string.
6. **Nightly rebuild.** Project > Settings > Builds > Deploy hooks: add one for branch `main`. Copy its URL into the
   GitHub repository: Settings > Secrets and variables > Actions > New secret named `CF_DEPLOY_HOOK`. Test with
   Actions > Nightly rebuild on Cloudflare Pages > Run workflow; a new build should appear in Cloudflare.
7. **Retire GitHub Pages.** Repository Settings > Pages: unpublish the old github.io site so only one copy exists.

## Hand the repository to the owner

1. **Her GitHub account.** She creates a free account (with two-factor sign-in on).
2. **Transfer.** Current owner: repository Settings > General > Danger Zone > Transfer ownership, to her username.
   She accepts from the email GitHub sends.
3. **Keep helping.** She adds you back: Settings > Collaborators > Add people (Write access is enough to push).
4. **Cloudflare after the move.** In the Pages project: Settings > Builds > Git repository, reconnect it to
   `<her-username>/rooted-haus` (she may need to approve the Cloudflare app on her GitHub account). Ideally the
   Cloudflare account and domain are hers too: Cloudflare can move a domain between accounts, or she can be added as a
   member under Manage Account > Members. Re-add the `CF_DEPLOY_HOOK` secret if it did not move with the repo.
5. **Your local copy.** `git remote set-url origin https://github.com/<her-username>/rooted-haus.git`
6. **Editing panel.** She signs in at https://app.pagescms.org with her GitHub account and allows the Pages CMS app on
   the repository when asked. Her panel link becomes `https://app.pagescms.org/<her-username>/rooted-haus/main`.
7. **Nightly rebuild.** The site also rebuilds every night so dated deals start and end on time. GitHub pauses scheduled
   workflows in a repository with no activity for 60 days (panel saves count as activity); if deals stop updating,
   re-enable it under Actions.

## Go live

1. **Content is real.** Walk `content-checklist.md`; search the site for "Placeholder", "from $—", "Client name", "coming soon", "TODO".
2. **Boulevard overlay.** The owner's snippet is in `web/src/layouts/BaseLayout.astro`. Test: every "Book" button opens booking on top of the site; with the script blocked it opens the Boulevard page.
3. **Forms.** Put the form service address in the panel (Studio details, Contact form address). For resume uploads, also set the Job application form address to a service that accepts files (see `docs/forms.md`). Send a test from Contact, Careers (once with a PDF, once without) and the newsletter box.
4. **Domain.** rooted-haus.com is connected to Cloudflare Pages (setup step 4 above). Check https://rooted-haus.com
   and https://www.rooted-haus.com both load, the second redirecting to the first.
5. **Old site.** Redirect rosesalonspa.com to the new domain if she controls it; otherwise ask the previous owner. Update the website link on her Google Business profile, Instagram bio and Boulevard profile.
6. **Check.** Lighthouse (performance, accessibility, SEO at least 90), phone-width pass on every page, submit `sitemap-index.xml` in Google Search Console.
