// src/components/common/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../UI/Loader';

const roleRedirectMap = {
  STUDENT: '/student/dashboard',
  COUNSELLOR: '/counsellor/dashboard',
  INSTITUTION: '/institution/dashboard',
  ADMIN: '/admin/dashboard'
};

const PrivateRoute = ({ children, allowedRoles, isPublic = false }) => {
  const { auth } = useAuth();

  if (auth.loading) return <Loader />;

  // PUBLIC route case (e.g., login, register)
  if (isPublic) {
    if (auth.authenticated && auth.user?.role) {
      // Redirect to 127.0.0.1:5174 instead of dashboard
      window.location.href = import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL;
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
