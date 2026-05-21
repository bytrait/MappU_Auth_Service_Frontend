// StudentRegistrationForm.jsx

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema } from '../../validators/registerUser.validator';
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  getReferenceCodeDetails,
} from '../../api/authService';

import Input from '../UI/Input';
import Button from '../UI/Button';
import AuthCard from '../auth/AuthCard';
import AuthHeader from '../auth/AuthHeader';
import ImageSection from '../common/ImageSection';
import OverlayCard from '../common/OverlayCard';

import { toast } from 'sonner';
import { Link } from 'react-router-dom';

import authImage from '../../assets/auth-image.jpeg';
import logo from '../../assets/bytrait_logo.png';

const RESEND_STORAGE_KEY = 'register_otp_last_sent';
const RESEND_OTP_TIMEOUT = 300;

const StudentRegistrationForm = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [referenceLoading, setReferenceLoading] = useState(false);
  const [referenceDetails, setReferenceDetails] = useState(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [registrationMode, setRegistrationMode] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(RegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      otp: '',
      contact: '',
      referenceCode: '',
      registrationType: '',
      selectedSchoolId: '',
    },
  });

  const referenceCode = watch('referenceCode');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isOtpValid = (otp) => /^\d{6}$/.test(otp);

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
      toast.error(
        err?.response?.data?.message || 'Failed to send OTP'
      );
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
        message:
          err?.response?.data?.message ||
          'OTP verification failed',
      });

      toast.error(
        err?.response?.data?.message ||
        'OTP verification failed'
      );
    }
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;

    setSelectedSchoolId(schoolId);

    if (schoolId) {
      setValue('registrationType', 'SCHOOL', {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue('selectedSchoolId', schoolId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue('registrationType', '', {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue('selectedSchoolId', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    clearErrors('registrationType');
    clearErrors('selectedSchoolId');
  };

  const handlePersonalRegistrationChange = (e) => {
    const checked = e.target.checked;

    setIsPersonalRegistration(checked);

    if (checked) {
      setSelectedSchoolId('');

      setValue('registrationType', 'INDIVIDUAL', {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue('selectedSchoolId', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue('registrationType', '', {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue('selectedSchoolId', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    clearErrors('registrationType');
    clearErrors('selectedSchoolId');
  };

  const handleSchoolCheckboxChange = (e) => {
    const checked = e.target.checked;

    if (checked) {
      setIsPersonalRegistration(false); // Uncheck "Individual" checkbox
      setIsSchoolSelected(true); // Enable the dropdown
    } else {
      setIsSchoolSelected(false); // Disable the dropdown
      setSelectedSchoolId(''); // Clear the selected school
      setValue('registrationType', '', { shouldValidate: true });
      setValue('selectedSchoolId', '', { shouldValidate: true });
    }

    clearErrors('registrationType');
    clearErrors('selectedSchoolId');
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

    try {
      const payload = {
        ...data,
        role: 'STUDENT',
        referenceCode: data.referenceCode?.toUpperCase(),
      };

      console.log('Registration Payload:', payload);

      await registerUser(payload);

      toast.success('Registration successful');

      window.location.href =
        import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL +
        '/';
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message;

      const backendErrors =
        err?.response?.data?.errors;

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

      toast.error(
        backendMessage || 'Registration failed'
      );
    }
  };

  useEffect(() => {
    const fetchReferenceDetails = async () => {
      if (!referenceCode || referenceCode.length !== 6) {
        setReferenceDetails(null);
        setSelectedSchoolId('');
        setRegistrationMode('');
        setValue('registrationType', '', {
          shouldValidate: true,
        });

        setValue('selectedSchoolId', '', {
          shouldValidate: true,
        });

        return;
      }

      try {
        setReferenceLoading(true);

        const response = await getReferenceCodeDetails(
          referenceCode.toUpperCase()
        );

        setReferenceDetails(response.data.data);

        clearErrors('referenceCode');
      } catch (err) {
        setReferenceDetails(null);
        setSelectedSchoolId('');
        setIsPersonalRegistration(false);
        setValue('registrationType', '', {
          shouldValidate: true,
        });

        setValue('selectedSchoolId', '', {
          shouldValidate: true,
        });

        setError('referenceCode', {
          type: 'manual',
          message:
            err?.response?.data?.message ||
            'Invalid reference code',
        });
      } finally {
        setReferenceLoading(false);
      }
    };

    fetchReferenceDetails();
  }, [referenceCode, clearErrors, setError, setValue]);

  useEffect(() => {
    const lastSent = localStorage.getItem(
      RESEND_STORAGE_KEY
    );

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

  const handleRegistrationModeChange = (e) => {
    const value = e.target.value;

    setRegistrationMode(value);

    setValue('registrationType', value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (value !== 'SCHOOL') {
      setSelectedSchoolId('');
      setValue('selectedSchoolId', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    clearErrors('registrationType');
    clearErrors('selectedSchoolId');
  };

  return (
    <div className="min-h-screen flex max-w-[1600px] mx-auto bg-white rounded-2xl overflow-hidden p-2">
      <ImageSection image={authImage}>
        <OverlayCard />
      </ImageSection>

      <AuthCard>
        <AuthHeader logo={logo} page={'Sign Up'} />

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
              {...register('referenceCode')}
              error={errors.referenceCode?.message}
              placeholder="Enter counsellor reference code"
            />

            {referenceLoading && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Validating reference code...
              </div>
            )}

            {/* Always show the checkboxes and dropdown */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
              <div className="flex items-center gap-6">
                {/* Individual Radio */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="registrationMode"
                    value="INDIVIDUAL"
                    checked={registrationMode === 'INDIVIDUAL'}
                    onChange={handleRegistrationModeChange}
                    disabled={!referenceDetails}
                    className="accent-blue-600"
                  />
                  <span className={`${!referenceDetails ? 'text-gray-400' : ''}`}>
                    Individual
                  </span>
                </label>

                {/* School Radio */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="registrationMode"
                    value="SCHOOL"
                    checked={registrationMode === 'SCHOOL'}
                    onChange={handleRegistrationModeChange}
                    disabled={!referenceDetails}
                    className="accent-blue-600"
                  />
                  <span className={`${!referenceDetails ? 'text-gray-400' : ''}`}>
                    School
                  </span>
                </label>
              </div>

              {/* Dropdown for selecting a school */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${!referenceDetails || !selectedSchoolId
                    ? 'text-gray-400'
                    : 'text-gray-700'
                    }`}
                >
                  Select School
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={handleSchoolChange}
                  disabled={!referenceDetails || registrationMode !== 'SCHOOL'}
                  className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-primary transition ${!referenceDetails || registrationMode !== 'SCHOOL'
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : registrationMode === 'SCHOOL'
                        ? 'bg-white border-gray-200 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                >
                  <option value="" >
                    Select a school
                  </option>                  {referenceDetails?.registrationOptions
                    ?.filter((option) => option.type !== 'INDIVIDUAL')
                    .map((option) => (
                      <option key={option.schoolId} value={option.schoolId}>
                        {option.label}
                      </option>
                    ))}
                </select>

                {errors.selectedSchoolId?.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.selectedSchoolId.message}
                  </p>
                )}
              </div>
            </div>

            <input
              type="hidden"
              {...register('registrationType')}
            />

            <input
              type="hidden"
              {...register('selectedSchoolId')}
            />
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
              !acceptedTerms
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