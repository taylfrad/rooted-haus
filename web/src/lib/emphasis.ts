/**
 * Headings can set one phrase in the handwritten font: put stars around it in the panel.
 * "Make yourself *at home*" becomes plain "Make yourself " followed by an accented "at home".
 */
export function emphasis(text: string): { text: string; accent: boolean }[] {
  return text
    .split(/\*([^*]+)\*/)
    .map((part, i) => ({ text: part, accent: i % 2 === 1 }))
    .filter((part) => part.text !== '');
}

/** The same heading with the stars taken out, for places that need plain words (labels read aloud, page titles). */
export const plain = (text: string) => text.replace(/\*/g, '');
