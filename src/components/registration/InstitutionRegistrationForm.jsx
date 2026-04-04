import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema } from '../../validators/registerUser.validator';
import { registerUser, sendRegisterOtp, verifyRegisterOtp } from '../../api/authService';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Loader from '../UI/Loader';
import { toast } from 'sonner';

const InstitutionRegistrationForm = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [timer, setTimer] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      otp: '',
      contact: '',
      schoolCode: '',
    },
  });

  const email = watch('email');
  const otp = watch('otp');

  // --- Timer Persistence ---
  useEffect(() => {
    const storedTimestamp = localStorage.getItem('institutionOtpTimestamp');
    if (storedTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(storedTimestamp, 10)) / 1000);
      if (elapsed < 300) {
        setTimer(300 - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    try {
      await sendRegisterOtp({ email });
      toast.success('OTP sent successfully!');
      setShowOtpField(true);
      setTimer(300);
      localStorage.setItem('institutionOtpTimestamp', Date.now().toString());
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
        role: 'INSTITUTION',
        fullName: data.fullName,
      });
      toast.success('Institution registered successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Input
        label="Institution Name"
        {...register('fullName')}
        placeholder="Enter institution name"
        error={errors.fullName?.message}
      />

      <div className="flex gap-2 items-end">
        <div className="w-full">
          <Input
            label="Email"
            {...register('email')}
            placeholder="Enter email"
            error={errors.email?.message}
          />
        </div>
        <Button
          type="button"
          className="w-50"
          onClick={handleSendOtp}
          disabled={!email || isSubmitting || timer > 0}
        >
          {timer > 0 ? `Resend OTP (${timer}s)` : 'Send OTP'}
        </Button>
      </div>

      {showOtpField && (
        <div className="flex gap-2 items-end">
          <div className="w-full">
            <Input
              label="OTP"
              {...register('otp')}
              placeholder="Enter OTP"
              error={errors.otp?.message}
            />
          </div>
          <Button
            type="button"
            className="w-50"
            onClick={handleVerifyOtp}
            disabled={!otp || isSubmitting}
          >
            Verify OTP
          </Button>
        </div>
      )}

      <Input
        label="Contact Number"
        {...register('contact')}
        placeholder="Enter contact number"
        error={errors.contact?.message}
      />

      <Button type="submit" disabled={!emailVerified || isSubmitting} className="w-full">
        {isSubmitting ? <Loader /> : 'Register'}
      </Button>
    </form>
  );
};

export default InstitutionRegistrationForm;
