// POST /api/apply: the Careers page application form. Cloudflare Pages Functions cannot send email themselves, so this
// hands the request to the careers mailer Worker (workers/careers) through the CAREERS service binding, set on the
// Pages project for production and preview.
export async function onRequestPost({ request, env }) {
  if (!env.CAREERS) {
    return Response.json({ success: false, message: 'Applications are not set up on this copy of the site.' }, { status: 503 });
  }
  return env.CAREERS.fetch(request);
}
