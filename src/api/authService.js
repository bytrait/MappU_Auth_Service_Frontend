// src/api/authService.js

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

/**
 * Preview a reference code tied to one token (counsellor or school).
 */
export const getReferenceCodeDetails = (referenceCode) =>
  api.get('/auth/reference-code-details', {
    params: { referenceCode },
  });

export const registerUser = (payload) =>
  api.post('/auth/register', payload);

/**
 * Register a student; server derives registration context from the token.
 */
export const registerStudent = (payload) =>
  registerUser({
    fullName: payload.fullName,
    email: payload.email,
    contact: payload.contact,
    role: 'STUDENT',
    referenceCode: payload.referenceCode,
  });

export const checkAuthStatus = async () => {
  const response = await api.get('/auth/isAuthenticated');
  return response.data;
};
