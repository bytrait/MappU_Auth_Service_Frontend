// src/components/common/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../UI/Loader';
import { useTenant } from '../../tenant/TenantContext';
import { platformRedirectUrl } from '../../tenant/slug';

const PrivateRoute = ({ children, allowedRoles, isPublic = false }) => {
  const { auth } = useAuth();
  const tenant = useTenant();

  if (auth.loading) return <Loader />;

  // PUBLIC route case (e.g., login, register)
  if (isPublic) {
    if (auth.authenticated && auth.user?.role) {
      window.location.href = platformRedirectUrl(tenant?.code, '/');
      return null;
    }
    return children;
  }

  // PRIVATE route case
  if (!auth.authenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
