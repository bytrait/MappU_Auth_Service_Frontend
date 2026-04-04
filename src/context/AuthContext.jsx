import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ loading: true, authenticated: false, user: null });
    const navigate = useNavigate();

    useEffect(() => {
    const fetchAuth = async () => {
        try {
            const res = await checkAuthStatus();

            if (res?.data?.authenticated) {
                setAuth({ loading: false, authenticated: true, user: res.data.user });

                // Redirect only if on auth-related pages
                if (['/', '/login'].includes(window.location.pathname)) {
                    window.location.href = import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL;
                }
            } else {
                setAuth({ loading: false, authenticated: false, user: null });
            }
        } catch (err) {
            setAuth({ loading: false, authenticated: false, user: null });
        }
    };

    fetchAuth();
}, [navigate]);


    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
