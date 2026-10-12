/**
 * Decides whether a seasonal deal should be shown right now.
 *
 * TODO(Taylor): this is a deliberate decision point. A deal's `start` and `end` come from the panel as
 * calendar dates (e.g. 2026-12-01 → 2026-12-24). Things to decide:
 *  - Is `end` inclusive (deal still shows all day on the 24th) or exclusive?
 *  - Which time zone defines "today"? The studio is in Louisiana (America/Chicago), but the static
 *    site is built on a GitHub server in UTC, and the nightly rebuild runs at 08:00 UTC.
 * The version below treats both dates as inclusive and compares against the build time in UTC.
 */
export function isDealActive(deal: { start: Date; end: Date }, now: Date = new Date()): boolean {
  const endOfLastDay = new Date(deal.end.getTime() + 24 * 60 * 60 * 1000);
  return now >= deal.start && now < endOfLastDay;
}
