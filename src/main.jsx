import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import './i18n';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner';
import { TenantProvider } from "./tenant/TenantContext"
import BrandingProvider from "./tenant/branding/BrandingProvider"

import { fetchTenant } from "./tenant/tenantService"
const tenant = await fetchTenant()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TenantProvider tenant={tenant}>
        <BrandingProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster richColors position="top-right" />
              <App />
            </AuthProvider>
          </BrowserRouter>
        </BrandingProvider>
    </TenantProvider>
  </StrictMode>
);
