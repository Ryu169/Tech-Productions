/**
 * Resolve a public-folder asset path to one that respects Vite's base URL.
 * In dev: BASE_URL is "/", so asset("logo-tp.png") → "/logo-tp.png".
 * On GitHub Pages with base "/Tech-Productions/", same input becomes
 * "/Tech-Productions/logo-tp.png".
 */
export function asset(path) {
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`;
}
