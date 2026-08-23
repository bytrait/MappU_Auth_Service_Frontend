// src/api/authService.js

import api from './axios';
import { getSlugFromPath } from '../tenant/slug';

function withTenant(payload = {}) {
  const tenantSlug = getSlugFromPath();
  return { ...payload, tenantSlug };
}

export const sendLoginOtp = ({ email }) => {
  return api.post('/auth/send-login-otp', withTenant({ email }));
};

export const verifyLoginOtp = ({ email, otp }) => {
  return api.post('/auth/verify-login-otp', withTenant({ email, otp }));
};

export const sendRegisterOtp = (payload) =>
  api.post('/auth/send-register-otp', withTenant(payload));

export const verifyRegisterOtp = (payload) =>
  api.post('/auth/verify-register-otp', withTenant(payload));

/**
 * Preview a reference code tied to one token (counsellor or school).
 */
export const getReferenceCodeDetails = (referenceCode) =>
  api.get('/auth/reference-code-details', {
    params: { referenceCode },
  });

export const registerUser = (payload) =>
  api.post('/auth/register', withTenant(payload));

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
