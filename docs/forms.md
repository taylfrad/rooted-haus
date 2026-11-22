# Forms and resume uploads

The site has no server of its own, so contact, newsletter and job application forms post to an outside form service. Each service emails the owner what visitors send. The addresses are set in the editing panel under "Studio details".

| Setting in the panel | Used by |
|---|---|
| Contact form address | Contact message, newsletter signup, and (unless the next one is filled in) job applications |
| Job application form address | Careers page, with the resume box. **Must belong to a service that accepts file uploads.** |
| Form service access key | Only for services that issue one (Web3Forms does). Sent with every submission. |

**Nothing half-working is shown.** Until the contact form address is set, the message form and newsletter signup on
Connect are hidden, the footer drops its newsletter line and "Join the list" button, and the careers page asks
applicants to call (or email, if an email is set in Studio details). Everything appears on its own once the address
is saved. The resume box appears only when the job application address is set.

## Resume upload (Careers page)

Visitors can attach an optional PDF, DOC or DOCX of up to 5 MB. The page rejects other file types and bigger files immediately, and shows a thank-you or an error with the studio phone number after sending. Everything works the same on any host; only the form service decides whether uploads are accepted.

Which services accept uploads (from vendor help pages and comparison sites; plans and prices change, so confirm on each vendor's pricing page before buying):

| Service | Uploads on the free plan? | Notes |
|---|---|---|
| Web3Forms | No. Pro plan only (about $149 a year) | Single file up to 5 MB on Pro. Free plan covers plain forms (about 250 a month). |
| Formspree | No. Paid plans only | Up to 25 MB per file on paid plans. Free plan is 50 submissions a month. |

The site is hosted on Cloudflare Pages, so host-specific form services (such as Netlify Forms) do not apply.

Recommended path: use a free service for the contact and newsletter forms. For resume uploads, a paid Web3Forms or Formspree plan for the one careers form is the simplest fix. Until the job application address is set, applications go through the contact address without the resume box, so no file can be dropped by a service that does not accept uploads.

## Privacy

A resume holds personal details. It travels to the form service and then to the owner's email, and the service keeps a copy for a limited time (about 30 days on free plans). The Careers page tells applicants the resume is used only to consider their application, so the owner should not forward or reuse resumes for anything else. If a privacy policy page is added later, mention the form service in it.

## Testing a new form address

1. Put the address (and access key if there is one) in the panel and let the site rebuild.
2. Submit the Careers form with a small PDF, and a second time with no file.
3. Confirm both emails arrive and the PDF opens.
