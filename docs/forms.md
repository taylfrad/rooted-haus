# Forms and resume uploads

The site has no server of its own, so contact, newsletter and job application forms post to an outside form service. Each service emails the owner what visitors send. The addresses are set in the editing panel under "Studio details".

| Setting in the panel | Used by |
|---|---|
| Contact form address | Contact message, newsletter signup, and (unless the next one is filled in) job applications |
| Job application form address | Careers page. **Must belong to a service that accepts file uploads.** |
| Form service access key | Only for services that issue one (Web3Forms does). Sent with every submission. |

## Resume upload (Careers page)

Visitors can attach an optional PDF, DOC or DOCX of up to 5 MB. The page rejects other file types and bigger files immediately, and shows a thank-you or an error with the studio phone number after sending. Everything works the same on any host; only the form service decides whether uploads are accepted.

Which services accept uploads (from vendor help pages and comparison sites; plans and prices change, so confirm on each vendor's pricing page before buying):

| Service | Uploads on the free plan? | Notes |
|---|---|---|
| Web3Forms | No. Pro plan only (about $149 a year) | Single file up to 5 MB on Pro. Free plan covers plain forms (about 250 a month). |
| Formspree | No. Paid plans only | Up to 25 MB per file on paid plans. Free plan is 50 submissions a month. |
| Netlify Forms | Yes | Only if the site is hosted on Netlify; request size limit of about 8 MB. Needs the form marked up for Netlify, which would be a small change here. |

Recommended path: use a free service for the contact and newsletter forms, and decide on the careers upload when the host is chosen. If the host ends up being Netlify, uploads cost nothing extra. If not, a paid Web3Forms or Formspree plan for one form is the simplest fix. Until the job application address is set, the form falls back to the contact address, and a form service without upload support will drop or reject the file.

## Privacy

A resume holds personal details. It travels to the form service and then to the owner's email, and the service keeps a copy for a limited time (about 30 days on free plans). The Careers page tells applicants the resume is used only to consider their application, so the owner should not forward or reuse resumes for anything else. If a privacy policy page is added later, mention the form service in it.

## Testing a new form address

1. Put the address (and access key if there is one) in the panel and let the site rebuild.
2. Submit the Careers form with a small PDF, and a second time with no file.
3. Confirm both emails arrive and the PDF opens.
