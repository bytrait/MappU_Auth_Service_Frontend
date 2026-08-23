import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import './i18n';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner';
import { TenantProvider } from './tenant/TenantContext';
import BrandingProvider from './tenant/branding/BrandingProvider';
import { fetchTenant } from './tenant/tenantService';
import { getSlugFromPath, DEFAULT_TENANT_SLUG } from './tenant/slug';

const slug = getSlugFromPath();
let tenant;
try {
  tenant = await fetchTenant(slug);
} catch (err) {
  console.error('Tenant load failed, using ByTrait defaults', err);
  tenant = {
    code: DEFAULT_TENANT_SLUG,
    name: 'ByTrait',
    plan: 'basic',
    theme: { favicon: '/favicon.ico' },
    customization: {},
  };
}

const basename = `/${tenant.code || slug || DEFAULT_TENANT_SLUG}`;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TenantProvider tenant={tenant}>
      <BrandingProvider>
        <BrowserRouter basename={basename}>
          <AuthProvider>
            <Toaster richColors position="top-right" />
            <App />
          </AuthProvider>
        </BrowserRouter>
      </BrandingProvider>
    </TenantProvider>
  </StrictMode>
);
