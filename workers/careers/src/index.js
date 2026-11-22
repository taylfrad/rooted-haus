/**
 * Careers application mailer for The Rooted Haus.
 *
 * The Careers page form posts to /api/apply on the site (functions/api/apply.js), which hands the request to this
 * Worker over a service binding. It has no public address of its own. It checks the spam token (Turnstile),
 * validates the answers and the optional resume, and emails the application to the studio with the resume attached
 * and Reply-To set to the applicant, so replying goes straight to them.
 *
 * Settings live in Cloudflare, not in this file (the repository is public):
 *   EMAIL            send_email binding (wrangler.jsonc)
 *   TO_ADDRESS       where applications go; must be a verified Email Routing destination address
 *   FROM_ADDRESS     optional, defaults to careers@rooted-haus.com
 *   TURNSTILE_SECRET secret for the Turnstile widget on the form
 */

const MAX_BODY = 6 * 1024 * 1024; // the whole request: a 5 MB resume plus the text fields
const MAX_FILE = 5 * 1024 * 1024;
const LIMITS = { name: 120, email: 200, phone: 40, interest: 80, experience: 60, license: 60, portfolio: 300, message: 5000 };
const REQUIRED = ['name', 'email', 'interest', 'message'];
const LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  interest: 'Interested in',
  experience: 'Years of experience',
  license: 'Cosmetology license',
  portfolio: 'Instagram or portfolio',
  message: 'About them',
};
// Resume types, checked by the file's first bytes rather than its name.
const TYPES = [
  { ext: 'pdf', mime: 'application/pdf', magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { ext: 'doc', mime: 'application/msword', magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE compound file
  { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', magic: [0x50, 0x4b, 0x03, 0x04] }, // zip
];

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return reply(405, 'Please send the form.');
    if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return reply(413, 'That file is too large. Please choose one under 5 MB.');

    let form;
    try {
      form = await request.formData();
    } catch {
      return reply(400, 'That did not come through. Please try again.');
    }

    // The hidden "botcheck" box is only ever filled in by bots: pretend it worked and send nothing.
    if (str(form.get('botcheck'))) return Response.json({ success: true });

    const ip = request.headers.get('cf-connecting-ip') ?? '';
    if (!(await humanCheck(str(form.get('cf-turnstile-response')), ip, env))) {
      return reply(400, 'Please complete the "verify you are human" check and send again.');
    }

    const answers = {};
    for (const key of Object.keys(LIMITS)) answers[key] = str(form.get(key)).slice(0, LIMITS[key]);
    const missing = REQUIRED.filter((k) => !answers[k]);
    if (missing.length) return reply(400, `Please fill in: ${missing.map((k) => LABELS[k]).join(', ')}.`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email)) return reply(400, 'Please check your email address.');

    let attachment;
    const file = form.get('resume');
    if (file && typeof file === 'object' && file.size > 0) {
      if (file.size > MAX_FILE) return reply(400, 'Your resume is over 5 MB. Please choose a smaller file.');
      const bytes = new Uint8Array(await file.arrayBuffer());
      const type = TYPES.find((t) => t.magic.every((b, i) => bytes[i] === b));
      const ext = (file.name.split('.').pop() ?? '').toLowerCase();
      // A .docx is a zip, so the zip signature only counts when the name says docx.
      if (!type || (type.ext === 'docx' && ext !== 'docx')) return reply(400, 'Please attach your resume as a PDF, DOC or DOCX file.');
      attachment = { content: bytes.buffer, filename: `Resume - ${safeName(answers.name)}.${type.ext}`, type: type.mime, disposition: 'attachment' };
    }

    const subject = oneLine(`Job application: ${answers.name} (${answers.interest})`);
    const rows = Object.keys(LABELS).filter((k) => answers[k]);
    const text = [
      'A new application from the Careers page on rooted-haus.com.',
      '',
      ...rows.map((k) => `${LABELS[k]}: ${answers[k]}`),
      '',
      attachment ? 'Their resume is attached.' : 'No resume was attached.',
      'Reply to this email to answer them directly.',
    ].join('\n');
    const html = `<p>A new application from the Careers page on rooted-haus.com.</p>
<table cellpadding="6" style="border-collapse:collapse">${rows
      .map((k) => `<tr><th align="left" valign="top">${LABELS[k]}</th><td style="white-space:pre-wrap">${esc(answers[k])}</td></tr>`)
      .join('')}</table>
<p>${attachment ? 'Their resume is attached.' : 'No resume was attached.'} Reply to this email to answer them directly.</p>`;

    try {
      await env.EMAIL.send({
        from: { email: env.FROM_ADDRESS || 'careers@rooted-haus.com', name: 'The Rooted Haus Careers' },
        to: env.TO_ADDRESS,
        replyTo: { email: answers.email, name: answers.name },
        subject,
        text,
        html,
        ...(attachment ? { attachments: [attachment] } : {}),
      });
    } catch (err) {
      console.error('send failed', err && err.message);
      return reply(502, 'Sorry, that did not send. Please try again in a moment.');
    }
    return Response.json({ success: true });
  },
};

async function humanCheck(token, ip, env) {
  if (!token || !env.TURNSTILE_SECRET) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    return (await res.json()).success === true;
  } catch {
    return false;
  }
}

const reply = (status, message) => Response.json({ success: false, message }, { status });
const str = (v) => (typeof v === 'string' ? v.trim() : '');
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ').slice(0, 200);
const safeName = (s) => s.replace(/[^\p{L}\p{N} .'-]/gu, '').trim().slice(0, 60) || 'applicant';
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
