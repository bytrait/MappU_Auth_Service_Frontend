import { careerApi } from '../api/axios';
import { DEFAULT_TENANT_SLUG, getSlugFromPath } from './slug';

/**
 * Fetch tenant brand config by URL slug.
 * Uses career gateway /api/v1/tenant (proxied in vite).
 */
export async function fetchTenant(slug = getSlugFromPath()) {
  const resolved = slug || DEFAULT_TENANT_SLUG;

  const res = await careerApi.get('/api/v1/tenant', {
    params: { slug: resolved },
    headers: { 'X-Tenant-Slug': resolved },
  });

  if (!res?.data) {
    throw new Error('Failed to load tenant');
  }

  return {
    ...res.data,
    code: res.data.code || resolved,
    plan: res.data.plan || 'basic',
    theme: res.data.theme || {},
    customization: res.data.customization || {},
  };
}
