import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  registerUser,
  sendRegisterOtp,
  verifyRegisterOtp,
} from '../../api/authService';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { CounsellorRegistrationSchema } from '../../validators/counsellorRegister.validator';

const OTP_TIMER_KEY = 'counsellor_registration_otp_timer';

const CounsellorRegistrationForm = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CounsellorRegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      otp: '',
      contact: '',
    },
  });

  const email = watch('email');
  const otp = watch('otp');

  // Restore timer from localStorage
  useEffect(() => {
    const storedTimestamp = localStorage.getItem(OTP_TIMER_KEY);
    if (storedTimestamp) {
      const remaining = Math.floor(
        (parseInt(storedTimestamp, 10) - Date.now()) / 1000
      );
      if (remaining > 0) {
        setTimer(remaining);
        setOtpSent(true);
      }
    }
  }, []);

  // Countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(OTP_TIMER_KEY);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    try {
      await sendRegisterOtp({ email });
      toast.success('OTP sent successfully!');
      setOtpSent(true);

      const expiryTimestamp = Date.now() + 60 * 1000;
      localStorage.setItem(OTP_TIMER_KEY, expiryTimestamp.toString());
      setTimer(60);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyRegisterOtp({ email, otp });
      setEmailVerified(true);
      toast.success('OTP verified successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid OTP');
    }
  };

  const onSubmit = async (data) => {
    if (!emailVerified) {
      toast.error('Please verify your email before registering');
      return;
    }

    try {
      await registerUser({
        ...data,
        role: 'COUNSELLOR',
      });

      toast.success('Registration successful!');
      window.location.href = import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL + "/counsellor/dashboard";
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mt-8 space-y-4">
      <Input
        label="Full Name"
        {...register('fullName')}
        placeholder="Enter your full name"
        error={errors.fullName?.message}
      />

      <div className="flex gap-2">
        <div className="w-full">
          <Input
            label="Email"
            {...register('email')}
            placeholder="Enter your email"
            error={errors.email?.message}
          />
        </div>
        <Button
          type="button"
          className="mt-7 w-50"
          onClick={handleSendOtp}
          disabled={!email || isSubmitting || timer > 0}
        >
          {timer > 0 ? `Resend OTP (${timer}s)` : 'Send OTP'}
        </Button>
      </div>

      {otpSent && (
        <div className="flex gap-2">
          <div className="w-full">
            <Input
              label="Enter OTP"
              {...register('otp')}
              placeholder="Enter OTP"
              error={errors.otp?.message}
            />
          </div>
          <Button
            type="button"
            className="mt-7 w-50"
            onClick={handleVerifyOtp}
            disabled={!otp || isSubmitting || emailVerified}
          >
            {emailVerified ? 'Verified' : 'Verify OTP'}
          </Button>
        </div>
      )}

      <Input
        label="Contact Number"
        {...register('contact')}
        placeholder="Enter your contact number"
        error={errors.contact?.message}
      />

      <Button
        type="submit"
        className="w-full mt-4"
        disabled={!emailVerified || isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default CounsellorRegistrationForm;
