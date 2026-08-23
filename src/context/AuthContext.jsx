import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuthStatus } from '../api/authService';
import { useTenant } from '../tenant/TenantContext';
import { platformRedirectUrl } from '../tenant/slug';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    authenticated: false,
    user: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const tenant = useTenant();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await checkAuthStatus();

        if (res?.data?.authenticated) {
          setAuth({
            loading: false,
            authenticated: true,
            user: res.data.user,
          });

          if (location.pathname === '/' || location.pathname === '/login') {
            window.location.href = platformRedirectUrl(tenant?.code, '/');
          }
        } else {
          setAuth({ loading: false, authenticated: false, user: null });
        }
      } catch (err) {
        setAuth({ loading: false, authenticated: false, user: null });
      }
    };

    fetchAuth();
  }, [navigate, location.pathname, tenant?.code]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
