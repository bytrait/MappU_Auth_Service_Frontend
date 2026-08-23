// StudentRegistrationForm.jsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentRegistrationSchema } from '../../validators/studentRegister.validator';
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  registerStudent,
  getReferenceCodeDetails,
} from '../../api/authService';
import { resolvePostRegisterRedirect } from '../../utils/postRegisterRedirect';

import Input from '../UI/Input';
import Button from '../UI/Button';
import AuthCard from '../auth/AuthCard';
import AuthHeader from '../auth/AuthHeader';
import ImageSection from '../common/ImageSection';
import OverlayCard from '../common/OverlayCard';

import { toast } from 'sonner';
import { Link } from 'react-router-dom';

import authImage from '../../assets/auth-image.jpeg';
import logo from '../../assets/mappu_logo.png';

const RESEND_STORAGE_KEY = 'register_otp_last_sent';
const RESEND_OTP_TIMEOUT = 300;
const REFERENCE_PREVIEW_DEBOUNCE_MS = 400;

const REFERENCE_PREVIEW_CODES = new Set([
  'CODE_NOT_YET_ACTIVE',
  'CODE_INVALID',
  'CODE_EXPIRED',
  'CODE_IN_USE',
  'SCHOOL_INACTIVE',
]);

const isReferenceCodeError = (err) =>
  err?.code?.startsWith('CODE_') ||
  REFERENCE_PREVIEW_CODES.has(err?.code) ||
  err?.status === 400 ||
  err?.status === 404 ||
  err?.status === 409;

const StudentRegistrationForm = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [referenceLoading, setReferenceLoading] = useState(false);
  const [referenceDetails, setReferenceDetails] = useState(null);
  const previewRequestId = useRef(0);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(StudentRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      otp: '',
      contact: '',
      referenceCode: '',
    },
  });

  const referenceCode = watch('referenceCode');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isOtpValid = (otp) => /^\d{6}$/.test(otp);

  const fetchReferencePreview = useCallback(
    async (rawCode) => {
      const code = rawCode?.trim().toUpperCase() || '';

      if (code.length < 4) {
        setReferenceDetails(null);
        clearErrors('referenceCode');
        return;
      }

      const requestId = ++previewRequestId.current;

      try {
        setReferenceLoading(true);

        const response = await getReferenceCodeDetails(code);

        if (previewRequestId.current !== requestId) return;
        if (getValues('referenceCode').toUpperCase() !== code) return;

        setReferenceDetails(response.data.data);
        clearErrors('referenceCode');
      } catch (err) {
        if (previewRequestId.current !== requestId) return;
        if (getValues('referenceCode').toUpperCase() !== code) return;

        setReferenceDetails(null);
        setError('referenceCode', {
          type: 'manual',
          message: err.message || 'Invalid reference code',
        });
      } finally {
        if (previewRequestId.current === requestId) {
          setReferenceLoading(false);
        }
      }
    },
    [clearErrors, getValues, setError]
  );

  const handleSendOtp = async () => {
    const email = getValues('email');

    if (!isValidEmail(email)) {
      setError('email', {
        type: 'manual',
        message: 'Enter a valid email address',
      });
      return;
    }

    try {
      await sendRegisterOtp({ email });

      localStorage.setItem(
        RESEND_STORAGE_KEY,
        Date.now().toString()
      );

      setIsOtpSent(true);
      setResendTimer(RESEND_OTP_TIMEOUT);

      toast.success('OTP sent successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    const { email, otp } = getValues();

    if (!isOtpValid(otp)) {
      setError('otp', {
        type: 'manual',
        message: 'OTP must be exactly 6 digits',
      });
      return;
    }

    try {
      await verifyRegisterOtp({ email, otp });

      setIsOtpVerified(true);
      clearErrors('otp');

      localStorage.removeItem(RESEND_STORAGE_KEY);

      toast.success('OTP verified successfully');
    } catch (err) {
      setError('otp', {
        type: 'manual',
        message: err.message || 'OTP verification failed',
      });

      toast.error(err.message || 'OTP verification failed');
    }
  };

  const onSubmit = async (data) => {
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions');
      return;
    }

    if (!isOtpVerified) {
      setError('otp', {
        type: 'manual',
        message: 'Please verify OTP before continuing',
      });
      return;
    }

    if (!referenceDetails) {
      setError('referenceCode', {
        type: 'manual',
        message: 'Please enter a valid reference code',
      });
      return;
    }

    try {
      const response = await registerStudent({
        fullName: data.fullName,
        email: data.email,
        contact: data.contact,
        referenceCode:
          referenceDetails.referenceCode || data.referenceCode,
      });

      const { message, payment } = response.data;

      const redirectUrl = resolvePostRegisterRedirect({
        payment: payment || null,
        careerPlatformUrl:
          import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL,
      });

      toast.success(message || 'Registration successful');

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      if (err.code === 'BILLING_STUDENT_PAYMENT_FAILED') {
        toast.error(
          err.message ||
            'Payment setup failed. Please try again or contact support.'
        );
        return;
      }

      if (isReferenceCodeError(err)) {
        setError('referenceCode', {
          type: 'server',
          message: err.message || 'Registration failed',
        });
        return;
      }

      const backendErrors = err.details?.errors;

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((fieldError) => {
          const fieldName = fieldError.path?.[0];

          if (fieldName) {
            setError(fieldName, {
              type: 'server',
              message: fieldError.message,
            });
          }
        });
      }

      if (err.status >= 500) {
        toast.error(err.message || 'Registration failed');
      } else if (!Array.isArray(backendErrors)) {
        toast.error(err.message || 'Registration failed');
      }
    }
  };

  useEffect(() => {
    if (!referenceCode || referenceCode.length < 4) {
      setReferenceDetails(null);
      clearErrors('referenceCode');
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchReferencePreview(referenceCode);
    }, REFERENCE_PREVIEW_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [referenceCode, clearErrors, fetchReferencePreview]);

  useEffect(() => {
    const lastSent = localStorage.getItem(RESEND_STORAGE_KEY);

    if (lastSent) {
      const elapsed = Math.floor(
        (Date.now() - Number(lastSent)) / 1000
      );

      if (elapsed < RESEND_OTP_TIMEOUT) {
        setIsOtpSent(true);
        setResendTimer(RESEND_OTP_TIMEOUT - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const showSchoolContext =
    referenceDetails?.display?.showSchoolName === true;

  const tokenLabel =
    referenceDetails?.display?.subtitle ||
    referenceDetails?.tokenLabel;

  return (
    <div className="min-h-screen flex max-w-[1600px] mx-auto bg-white rounded-2xl overflow-hidden p-4 md:p-6 gap-4 md:gap-8">
      <ImageSection image={authImage}>
        <OverlayCard />
      </ImageSection>

      <AuthCard>
        <AuthHeader logo={logo} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            label="Full Name"
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder="Enter your full name"
          />

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="Enter your email"
              />
            </div>

            <Button
              type="button"
              className="h-[48px] px-4 rounded-xl"
              onClick={handleSendOtp}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0
                ? `${Math.floor(resendTimer / 60)
                  .toString()
                  .padStart(2, '0')}:${(resendTimer % 60)
                    .toString()
                    .padStart(2, '0')}`
                : isOtpSent
                  ? 'Resend'
                  : 'Send OTP'}
            </Button>
          </div>

          {isOtpSent && (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label="OTP"
                  {...register('otp')}
                  error={errors.otp?.message}
                  placeholder="Enter OTP"
                />
              </div>

              <Button
                type="button"
                className="h-[48px] px-4 rounded-xl"
                onClick={handleVerifyOtp}
                disabled={isOtpVerified}
              >
                {isOtpVerified ? 'Verified' : 'Verify'}
              </Button>
            </div>
          )}

          <Input
            label="Contact Number"
            {...register('contact')}
            error={errors.contact?.message}
            placeholder="Enter contact number"
          />

          <div className="space-y-3">
            <Input
              label="Reference Code"
              maxLength={20}
              {...register('referenceCode')}
              onChange={(e) => {
                const v = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 20);
                setValue('referenceCode', v, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              onBlur={() => {
                const code = getValues('referenceCode');
                if (code && code.length >= 4) {
                  fetchReferencePreview(code);
                }
              }}
              error={errors.referenceCode?.message}
              placeholder="Enter reference code (4–20 characters)"
            />

            {referenceLoading && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Validating reference code...
              </div>
            )}

            {referenceDetails && !referenceLoading && showSchoolContext && (
              <div
                className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"
                aria-live="polite"
              >
                <p className="font-medium text-blue-900">
                  {referenceDetails.display?.title ||
                    referenceDetails.schoolName}
                </p>
                {tokenLabel && (
                  <p className="text-sm text-blue-700 mt-1">
                    {tokenLabel}
                  </p>
                )}
              </div>
            )}

            {referenceDetails &&
              !referenceLoading &&
              !showSchoolContext && (
                <div
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  aria-live="polite"
                >
                  {referenceDetails.counsellorName && (
                    <p className="font-medium text-gray-900">
                      {referenceDetails.counsellorName}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    Individual registration
                  </p>
                  {tokenLabel && (
                    <p className="text-sm text-gray-500 mt-1">
                      {tokenLabel}
                    </p>
                  )}
                </div>
              )}
          </div>

          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) =>
                setAcceptedTerms(e.target.checked)
              }
              className="mt-1 accent-blue-600"
            />

            <p className="text-sm text-gray-600">
              I agree to the{' '}
              <Link
                to="/termsandconditions"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Terms & Conditions
              </Link>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 rounded-full"
            disabled={
              isSubmitting ||
              !isOtpVerified ||
              !acceptedTerms ||
              !referenceDetails
            }
          >
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </AuthCard>
    </div>
  );
};

export default StudentRegistrationForm;
