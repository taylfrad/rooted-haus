import settings from '../content/settings.json';

/**
 * Business facts, edited in the Pages CMS panel (src/content/settings.json).
 * Address and phone are from the previous owner's site and need the owner's confirmation.
 */
export const site = {
  name: settings.name,
  tagline: settings.tagline,
  bookingUrl: settings.bookingUrl,
  /** Words on the main booking buttons (header, hero, Connect...). Falls back if left empty in the panel. */
  bookLabel: settings.bookLabel || 'Get Rooted',
  address: { line1: settings.addressLine1, city: settings.addressCity },
  phone: settings.phone,
  email: settings.email,
  hours: settings.hours,
  instagram: settings.instagram,
  facebook: settings.facebook,
  formEndpoint: settings.formEndpoint,
  /** Where job applications go. Must be a service that accepts file uploads; falls back to the general form address. */
  careersFormEndpoint: settings.careersFormEndpoint || settings.formEndpoint,
  /** Some form services (Web3Forms) need a public access key sent with every submission. */
  formAccessKey: settings.formAccessKey,
  giftCardsUrl: settings.giftCardsUrl,
  footerScript: settings.footerScript,
  footerNewsletter: settings.footerNewsletter,
  /** Shown at the bottom of every page; plain text, not a link. */
  websiteName: settings.websiteName,
};

// Map links are built from the address, so editing it in the panel updates every one of them.
const fullAddress = `${settings.addressLine1}, ${settings.addressCity}`;
const q = encodeURIComponent(fullAddress);
export const maps = {
  address: fullAddress,
  /** Small map for the page (Google's keyless embed). */
  embed: `https://www.google.com/maps?q=${q}&z=16&output=embed`,
  /** Opens Google Maps with the route to the salon already filled in. */
  google: `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`,
  /** Opens Apple Maps (the app on iPhone and Mac) with directions to the salon. */
  apple: `https://maps.apple.com/?daddr=${q}&dirflg=d`,
};

/** "Tue to Fri: 9am to 5pm", or just the text when there is no time (used for the placeholder). */
export const hoursLine = (h: { days: string; time?: string }) => (h.time ? `${h.days}: ${h.time}` : h.days);

export const nav = [
  { href: 'services/', label: 'The Rituals' },
  { href: 'team/', label: 'Meet the Haus' },
  { href: 'experience/', label: 'The Experience' },
  { href: 'gallery/', label: 'Gallery' },
  { href: 'contact/', label: 'Connect' },
];
