/**
 * Turns a photo's "Crop position" from the panel into a CSS object-position (which part of the photo to keep when it is
 * cropped to fit its frame). Every photo on the site goes through here: PhotoFrame and the Home slideshow.
 *
 * Accepts the CSS form directly: "50% 30%" means halfway across, 30% of the way down. Empty means centered.
 */
export function cropPosition(focus?: string): string | undefined {
  const value = focus?.trim();
  if (!value) return undefined;
  // TODO(Taylor): also accept plain words, so the owner can type "top" or "upper middle" instead of percentages.
  return value;
}
