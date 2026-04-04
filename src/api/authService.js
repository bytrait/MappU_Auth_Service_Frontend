import api from './axios';

export const sendLoginOtp = ({ email }) => {
    return api.post('/auth/send-login-otp', { email });
};

export const verifyLoginOtp = ({ email, otp }) => {
    return api.post('/auth/verify-login-otp', { email, otp });
};

export const sendRegisterOtp = (payload) =>
    api.post('/auth/send-register-otp', payload);

export const verifyRegisterOtp = (payload) =>
    api.post('/auth/verify-register-otp', payload);

export const registerUser = (payload) =>
    api.post('/auth/register', payload);

export const checkAuthStatus = async () => {
    const response = await api.get('/auth/isAuthenticated');
    return response.data;
};