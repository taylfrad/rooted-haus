/** Prefix an internal path with the configured base (e.g. /rooted-haus on GitHub Pages). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

/** Staging builds (served under a sub-path) must not be indexed. */
export const isStaging = import.meta.env.BASE_URL !== '/';
