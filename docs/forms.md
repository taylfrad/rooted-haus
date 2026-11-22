# Forms and resume uploads

There are two kinds of form on the site:

- **Job applications (Careers page)** are handled by the site itself on Cloudflare. They work out of the box and
  accept a resume, with no outside service and no cost.
- **Contact messages and newsletter signups (Connect page, footer)** still post to an outside form service. Its
  address is set in the editing panel under "Studio details".

| Setting in the panel | Used by |
|---|---|
| Contact form address | Contact message and newsletter signup |
| Form service access key | Only for services that issue one (Web3Forms does). Sent with contact and newsletter submissions. |

**Nothing half-working is shown.** Until the contact form address is set, the message form and newsletter signup on
Connect are hidden, and the footer drops its newsletter line and "Join the list" button. They appear on their own
once the address is saved.

## Job applications (Careers page)

Applicants fill in their name, email, phone, the role they want, years of experience, license status, an optional
Instagram or portfolio link, a few words about themselves, and an optional resume (PDF, DOC or DOCX, up to 5 MB).
A "verify you are human" check (Cloudflare Turnstile) stops spam bots.

Each application arrives by email from **careers@rooted-haus.com**, with the resume attached. Replying to the email
goes straight to the applicant. Mail sent to careers@rooted-haus.com is forwarded to the studio's inbox too.

The choices in the experience and license menus are edited in the panel (Plant Your Roots page > Application form).

### How it works

```
Careers form ── /api/apply (functions/api/apply.js, part of the Pages site)
                   └── CAREERS service binding ── Worker "rooted-haus-careers" (workers/careers)
                                                     ├── checks the Turnstile token
                                                     ├── checks every answer and the resume's real file type
                                                     └── emails it with Cloudflare Email Service
```

Cloudflare Pages cannot send email itself, so the sending happens in a small Worker that only the site can reach (it
has no public address). Sending to a verified address in the account is free.

Settings, all in the Cloudflare dashboard (none are in this repository, which is public):

| Where | What |
|---|---|
| Worker `rooted-haus-careers` > Settings > Variables | `TO_ADDRESS`: the inbox applications go to. It must be a verified Email Routing destination. |
| Worker `rooted-haus-careers` > Settings > Variables (secret) | `TURNSTILE_SECRET`: from the Turnstile widget "rooted-haus careers form" |
| Pages project `rooted-haus` > Settings > Bindings | `CAREERS` service binding to `rooted-haus-careers` (production and preview) |
| rooted-haus.com > Email > Email Routing | Destination addresses, and the rule careers@rooted-haus.com → studio inbox |
| Turnstile > "rooted-haus careers form" | Allowed hostnames: rooted-haus.com, rooted-haus.pages.dev, localhost |

### Changing the inbox applications go to

1. Email Routing > Destination addresses: add the new address. Cloudflare emails it a link; click it to verify.
2. Worker `rooted-haus-careers` > Settings > Variables: change `TO_ADDRESS` to the new address and deploy.
3. Email Routing > Routing rules: point careers@rooted-haus.com at the new address too.
4. Send a test application from the Careers page.

### Changing the Worker's code

Edit `workers/careers/src/index.js`, then from `workers/careers` run `npx wrangler deploy`. Its `keep_vars` setting
leaves `TO_ADDRESS` and the secret in place.

## Privacy

A resume holds personal details. It goes straight from the applicant's browser to Cloudflare and then to the studio's
email; the site keeps no copy. The Careers page tells applicants the resume is used only to consider their
application, so the owner should not forward or reuse resumes for anything else. If a privacy policy page is added
later, mention that applications are emailed to the studio.

## Testing

- **Careers:** on the live site or a branch preview (`*.rooted-haus.pages.dev`), send one application with a small PDF
  and one with no file. Confirm both emails arrive, the PDF opens, and Reply goes to the applicant's address.
  Applications cannot be tested with `pnpm dev`, which does not run the `/api` part.
- **Contact and newsletter:** put the form service address (and access key if there is one) in the panel, let the
  site rebuild, then send a test from each.
