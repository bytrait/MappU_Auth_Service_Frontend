// src/hooks/useAuthCheck.js
import { useEffect, useState } from 'react';
import { checkAuthStatus } from '../api/authService';

const useAuthCheck = () => {
  const [auth, setAuth] = useState({ loading: true, authenticated: false, user: null });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await checkAuthStatus();
        setAuth({ loading: false, authenticated: true, user: data.user });
      } catch (err) {
        setAuth({ loading: false, authenticated: false, user: null });
      }
    };
    checkAuth();
  }, []);

  return auth;
};

export default useAuthCheck;
