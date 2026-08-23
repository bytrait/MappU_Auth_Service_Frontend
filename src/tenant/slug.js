/** Default tenant slug (ByTrait platform brand). */
export const DEFAULT_TENANT_SLUG = 'bytrait';

/**
 * Path segments that are app routes, not tenant slugs.
 * When the first segment is one of these, treat tenant as default.
 */
const RESERVED_SEGMENTS = new Set([
  'login',
  'register',
  'role-selection',
  'student',
  'counsellor',
  'institution',
  'termsandconditions',
  'demo',
  'assessment',
  'report',
  'payment',
  'careers',
  'career',
  'career_content',
  'congratulations',
  'api',
  'assets',
  'favicons',
  'logos',
]);

/**
 * Read tenant slug from the first URL path segment.
 * Examples:
 *   /mappu/login          → mappu
 *   /mappu                → mappu
 *   /login                → bytrait (reserved)
 *   /                     → bytrait
 */
export function getSlugFromPath(pathname = window.location.pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return DEFAULT_TENANT_SLUG;

  const first = parts[0].toLowerCase();
  if (RESERVED_SEGMENTS.has(first)) return DEFAULT_TENANT_SLUG;
  if (first === 'default' || first === 'www') return DEFAULT_TENANT_SLUG;

  return first;
}

/**
 * Build a path under the current tenant slug.
 * tenantPath('mappu', '/login') → /mappu/login
 * tenantPath('bytrait', '/app') → /bytrait/app  (or omit slug for default if desired)
 */
export function tenantPath(slug, path = '/') {
  const cleanSlug = (slug || DEFAULT_TENANT_SLUG).toLowerCase();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${cleanSlug}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Absolute URL to the career platform for this tenant.
 */
export function platformRedirectUrl(slug, path = '/') {
  const base = (import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL || '').replace(
    /\/$/,
    ''
  );
  return `${base}${tenantPath(slug, path)}`;
}

/**
 * Absolute URL to the auth frontend for this tenant.
 */
export function authRedirectUrl(slug, path = '/') {
  const base = (import.meta.env.VITE_REDIRECT_URL || '').replace(/\/$/, '');
  return `${base}${tenantPath(slug, path)}`;
}
