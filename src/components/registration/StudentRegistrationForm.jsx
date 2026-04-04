// StudentRegistrationForm.jsx

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema } from '../../validators/registerUser.validator';
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  registerUser,
} from '../../api/authService';

import Input from '../UI/Input';
import Button from '../UI/Button';
import AuthCard from '../auth/AuthCard';
import AuthHeader from '../auth/AuthHeader';
import ImageSection from '../common/ImageSection';
import OverlayCard from '../common/OverlayCard';

import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// dummy paths (replace later)
import authImage from '../../assets/auth-image.jpeg';
import logo from '../../assets/bytrait_logo.png';

const RESEND_STORAGE_KEY = 'register_otp_last_sent';
const RESEND_OTP_TIMEOUT = 300;

const StudentRegistrationForm = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(RegistrationSchema),
    mode: 'onChange',
  });

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isOtpValid = (otp) => /^\d{6}$/.test(otp);

  const handleSendOtp = async () => {
    const email = getValues('email');

    if (!isValidEmail(email)) {
      setError('email', { message: 'Enter a valid email' });
      return;
    }

    try {
      await sendRegisterOtp({ email });
      localStorage.setItem(RESEND_STORAGE_KEY, Date.now().toString());

      setIsOtpSent(true);
      setResendTimer(RESEND_OTP_TIMEOUT);

      toast.success('OTP sent successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    const { email, otp } = getValues();

    if (!isOtpValid(otp)) {
      setError('otp', { message: 'OTP must be 6 digits' });
      return;
    }

    try {
      await verifyRegisterOtp({ email, otp });
      setIsOtpVerified(true);
      localStorage.removeItem(RESEND_STORAGE_KEY);
      toast.success('OTP verified successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'OTP verification failed');
    }
  };

  const onSubmit = async (data) => {
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions');
      return;
    }

    if (!data.otp || !isOtpVerified) {
      setError('otp', { message: 'OTP verification is required' });
      return;
    }

    try {
      await registerUser({
        ...data,
        role: 'STUDENT',
      });

      toast.success('Registration successful');
      window.location.href =
        import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL +
        '/counsellor/students';
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

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
      const timer = setTimeout(
        () => setResendTimer(resendTimer - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <div className="min-h-screen flex max-w-[1600px] mx-auto">

      {/* LEFT SIDE */}
      <ImageSection image={authImage}>
        <OverlayCard />
      </ImageSection>

      {/* RIGHT SIDE */}
      <AuthCard>
        <AuthHeader logo={logo} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Full Name */}
          <Input
            label="Full Name"
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder="Enter your full name"
          />

          {/* Email + OTP Button */}
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

          {/* OTP */}
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

          {/* Contact */}
          <Input
            label="Contact Number"
            {...register('contact')}
            error={errors.contact?.message}
            placeholder="Enter contact number"
          />

          {/* Reference Code */}
          <Input
            label="Reference Code"
            {...register('referenceCode')}
            error={errors.referenceCode?.message}
            placeholder="Enter counsellor or institution code"
          />

          {/* Terms */}
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
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

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-4 rounded-full"
            disabled={
              isSubmitting ||
              !isOtpVerified ||
              !isValid ||
              !acceptedTerms
            }
          >
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </Button>
        </form>

        {/* Footer */}
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