import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema } from '../validators/registerUser.validator';
import {
    sendRegisterOtp,
    verifyRegisterOtp,
    registerUser,
    getReferenceCodeDetails,
} from '../api/authService';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import logo from '../assets/bytrait_logo.png';
import rightTop from '../assets/image1.png';
import rightBottom from '../assets/image2.png';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { platformRedirectUrl, getSlugFromPath } from '../tenant/slug';

const RESEND_STORAGE_KEY = 'register_otp_last_sent';
const RESEND_OTP_TIMEOUT = 300;

const StudentRegistration = () => {
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

    // ── Send OTP ──────────────────────────────────────────
    const handleSendOtp = async () => {
        const email = getValues('email');
        if (!isValidEmail(email)) {
            setError('email', { type: 'manual', message: 'Enter a valid email address' });
            return;
        }
        try {
            await sendRegisterOtp({ email });
            localStorage.setItem(RESEND_STORAGE_KEY, Date.now().toString());
            setIsOtpSent(true);
            setResendTimer(RESEND_OTP_TIMEOUT);
            toast.success('OTP sent successfully. Please check your email.');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to send OTP');
        }
    };

    // ── Verify OTP ────────────────────────────────────────
    const handleVerifyOtp = async () => {
        const { email, otp } = getValues();
        if (!isOtpValid(otp)) {
            setError('otp', { type: 'manual', message: 'OTP must be exactly 6 digits' });
            return;
        }
        try {
            await verifyRegisterOtp({ email, otp });
            setIsOtpVerified(true);
            clearErrors('otp');
            localStorage.removeItem(RESEND_STORAGE_KEY);
            toast.success('OTP verified successfully.');
        } catch (err) {
            setError('otp', {
                type: 'manual',
                message: err?.response?.data?.message || 'OTP verification failed',
            });
            toast.error(err?.response?.data?.message || 'OTP verification failed');
        }
    };

    // ── Registration Mode (Individual / School) ───────────
    const handleRegistrationModeChange = (e) => {
        const value = e.target.value;
        setRegistrationMode(value);
        setValue('registrationType', value, { shouldValidate: true, shouldDirty: true });
        if (value !== 'SCHOOL') {
            setSelectedSchoolId('');
            setValue('selectedSchoolId', '', { shouldValidate: true, shouldDirty: true });
        }
        clearErrors('registrationType');
        clearErrors('selectedSchoolId');
    };

    // ── School Dropdown ───────────────────────────────────
    const handleSchoolChange = (e) => {
        const schoolId = e.target.value;
        setSelectedSchoolId(schoolId);
        if (schoolId) {
            setValue('registrationType', 'SCHOOL', { shouldValidate: true, shouldDirty: true });
            setValue('selectedSchoolId', schoolId, { shouldValidate: true, shouldDirty: true });
        } else {
            setValue('registrationType', '', { shouldValidate: true, shouldDirty: true });
            setValue('selectedSchoolId', '', { shouldValidate: true, shouldDirty: true });
        }
        clearErrors('registrationType');
        clearErrors('selectedSchoolId');
    };

    // ── Submit ────────────────────────────────────────────
    const onSubmit = async (data) => {
        if (!acceptedTerms) {
            toast.error('Please accept Terms & Conditions');
            return;
        }
        if (!isOtpVerified) {
            setError('otp', { type: 'manual', message: 'Please verify OTP before continuing' });
            return;
        }
        try {
            const payload = {
                ...data,
                role: 'STUDENT',
                referenceCode: data.referenceCode?.toUpperCase(),
            };
            await registerUser(payload);
            toast.success('Registration successful');
            window.location.href = platformRedirectUrl(getSlugFromPath(), '/');
        } catch (err) {
            const backendMessage = err?.response?.data?.message;
            const backendErrors = err?.response?.data?.errors;
            if (Array.isArray(backendErrors)) {
                backendErrors.forEach((fieldError) => {
                    const fieldName = fieldError.path?.[0];
                    if (fieldName) {
                        setError(fieldName, { type: 'server', message: fieldError.message });
                    }
                });
            }
            toast.error(backendMessage || 'Registration failed');
        }
    };

    // ── Auto-fetch reference code details ─────────────────
    useEffect(() => {
        const fetchReferenceDetails = async () => {
            if (!referenceCode || referenceCode.length !== 6) {
                setReferenceDetails(null);
                setSelectedSchoolId('');
                setRegistrationMode('');
                setValue('registrationType', '', { shouldValidate: true });
                setValue('selectedSchoolId', '', { shouldValidate: true });
                return;
            }
            try {
                setReferenceLoading(true);
                const response = await getReferenceCodeDetails(referenceCode.toUpperCase());
                setReferenceDetails(response.data.data);
                clearErrors('referenceCode');
            } catch (err) {
                setReferenceDetails(null);
                setSelectedSchoolId('');
                setRegistrationMode('');
                setValue('registrationType', '', { shouldValidate: true });
                setValue('selectedSchoolId', '', { shouldValidate: true });
                setError('referenceCode', {
                    type: 'manual',
                    message: err?.response?.data?.message || 'Invalid reference code',
                });
            } finally {
                setReferenceLoading(false);
            }
        };
        fetchReferenceDetails();
    }, [referenceCode, clearErrors, setError, setValue]);

    // ── Restore OTP timer from localStorage ───────────────
    useEffect(() => {
        const lastSent = localStorage.getItem(RESEND_STORAGE_KEY);
        if (lastSent) {
            const elapsed = Math.floor((Date.now() - Number(lastSent)) / 1000);
            if (elapsed < RESEND_OTP_TIMEOUT) {
                setIsOtpSent(true);
                setResendTimer(RESEND_OTP_TIMEOUT - elapsed);
            }
        }
    }, []);

    // ── Countdown timer ───────────────────────────────────
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    return (
        <div className="min-h-screen flex items-center">
            <div className="container mx-auto">
                <div className="flex flex-wrap">

                    {/* ── Left side (old design kept) ── */}
                    <div className="w-full md:w-5/12 p-8">
                        <div className="mb-6">
                            <img src={logo} alt="Logo" className="w-60 mb-4" />
                            <h1 className="text-2xl font-semibold mb-2">Register Student</h1>
                        </div>

                        <div className="bg-white">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                {/* Full Name */}
                                <Input
                                    label="Full Name"
                                    type="text"
                                    {...register('fullName')}
                                    error={errors.fullName?.message}
                                    placeholder="Enter your full name"
                                />

                                {/* Email + Send OTP */}
                                <div className="flex gap-2 items-end">
                                    <div className="w-full">
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
                                        onClick={handleSendOtp}
                                        disabled={resendTimer > 0}
                                    >
                                        {resendTimer > 0
                                            ? `Resend in ${String(Math.floor(resendTimer / 60)).padStart(2, '0')}:${String(resendTimer % 60).padStart(2, '0')}`
                                            : isOtpSent
                                                ? 'Resend OTP'
                                                : 'Send OTP'}
                                    </Button>
                                </div>

                                {/* OTP + Verify */}
                                {isOtpSent && (
                                    <div className="flex gap-2 items-end">
                                        <div className="w-full">
                                            <Input
                                                label="Enter OTP"
                                                type="text"
                                                {...register('otp')}
                                                error={errors.otp?.message}
                                                placeholder="Enter OTP"
                                            />
                                        </div>
                                        <Button
                                            type="button"
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
                                    type="text"
                                    {...register('contact')}
                                    error={errors.contact?.message}
                                    placeholder="Enter contact number"
                                />

                                {/* Reference Code + dynamic details */}
                                <div className="space-y-3">
                                    <Input
                                        label="Reference Code"
                                        type="text"
                                        {...register('referenceCode')}
                                        error={errors.referenceCode?.message}
                                        placeholder="Enter counsellor or institution code"
                                    />

                                    {referenceLoading && (
                                        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                                            Validating reference code...
                                        </div>
                                    )}

                                    {/* Individual / School selection */}
                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                                        <div className="flex items-center gap-6">
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
                                                <span className={!referenceDetails ? 'text-gray-400' : ''}>
                                                    Individual
                                                </span>
                                            </label>

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
                                                <span className={!referenceDetails ? 'text-gray-400' : ''}>
                                                    School
                                                </span>
                                            </label>
                                        </div>

                                        {/* School Dropdown */}
                                        <div>
                                            <label
                                                className={`block text-sm font-medium mb-2 ${
                                                    !referenceDetails || registrationMode !== 'SCHOOL'
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
                                                className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-primary transition ${
                                                    !referenceDetails || registrationMode !== 'SCHOOL'
                                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white border-gray-200 text-gray-700'
                                                }`}
                                            >
                                                <option value="">Select a school</option>
                                                {referenceDetails?.registrationOptions
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

                                    {/* Hidden fields */}
                                    <input type="hidden" {...register('registrationType')} />
                                    <input type="hidden" {...register('selectedSchoolId')} />
                                </div>

                                {/* Terms & Conditions */}
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
                                    className="w-full mt-4"
                                    disabled={isSubmitting || !isOtpVerified || !acceptedTerms}
                                >
                                    {isSubmitting ? 'Registering...' : 'Register'}
                                </Button>
                            </form>

                            <div className="mt-4">
                                <Link to="/" className="text-blue-500 hover:underline">
                                    Already have an account? Login
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Right side (old design kept) ── */}
                    <div className="hidden md:block md:w-7/12 relative z-[-1]">
                        <img
                            src={rightTop}
                            alt="Top Decoration"
                            className="fixed top-0 right-0 w-150 h-150"
                        />
                        <img
                            src={rightBottom}
                            alt="Bottom Decoration"
                            className="fixed bottom-0 right-0 w-200 h-200"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentRegistration;