// EmailOtpForm.jsx

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmailInput from './EmailInput';
import OtpInput from './OtpInput';
import Button from '../UI/Button';
import AuthCard from './AuthCard';
import AuthHeader from './AuthHeader';
import ImageSection from '../common/ImageSection';
import OverlayCard from '../common/OverlayCard';

import { sendLoginOtp, verifyLoginOtp } from '../../api/authService';
import { toast } from 'sonner';

// Dummy paths (you replace later)
import authImage from '../../assets/auth-image.jpeg';
import logo from '../../assets/bytrait_logo.png';

const RESEND_OTP_TIMEOUT = 300;
const RESEND_STORAGE_KEY = 'otp_last_sent';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');

    const secs = (seconds % 60)
        .toString()
        .padStart(2, '0');

    return `${mins}:${secs}`;
};

const EmailOtpForm = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const navigate = useNavigate();

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isOtpValid = (otp) => /^\d{6}$/.test(otp);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await sendLoginOtp({ email });

            const now = Date.now();
            localStorage.setItem(RESEND_STORAGE_KEY, now.toString());

            setOtpSent(true);
            setResendTimer(RESEND_OTP_TIMEOUT);

            toast.success('OTP sent successfully');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await verifyLoginOtp({ email, otp });

            toast.success('Login successful');
            localStorage.removeItem(RESEND_STORAGE_KEY);

            window.location.href = import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_URL;
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lastSent = localStorage.getItem(RESEND_STORAGE_KEY);

        if (lastSent) {
            const elapsed = Math.floor(
                (Date.now() - Number(lastSent)) / 1000
            );

            if (elapsed < RESEND_OTP_TIMEOUT) {
                setOtpSent(true);
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
        <div className="min-h-screen mx-auto flex max-w-[1600px]">

            {/* LEFT IMAGE */}
            <ImageSection image={authImage}>
                <OverlayCard />
            </ImageSection>

            {/* RIGHT FORM */}
            <AuthCard>
                <AuthHeader logo={logo} />

                <EmailInput email={email} setEmail={setEmail} />

                {!otpSent && (
                    <Button
                        className="w-full mt-4 rounded-full"
                        onClick={handleSendOtp}
                        disabled={!isValidEmail(email) || loading}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                )}

                {otpSent && (
                    <>
                        <OtpInput otp={otp} setOtp={setOtp} />

                        <div className="flex justify-between text-sm mt-2">
                            {resendTimer > 0 ? (
                                <span className="text-gray-500 font-medium">
                                    Resend in {formatTime(resendTimer)}
                                </span>
                            ) : (
                                <button
                                    onClick={handleSendOtp}
                                    className="text-blue-600"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <Button
                            className="w-full mt-4 rounded-full"
                            onClick={handleLogin}
                            disabled={!isOtpValid(otp) || loading}
                        >
                            {loading ? 'Verifying...' : 'Sign In'}
                        </Button>
                    </>
                )}

                <p className="text-center text-sm mt-6 text-default">
                    Don’t have an account?{' '}
                    <Link to="/register/student" className="text-primary">
                        Sign Up
                    </Link>
                    <br />
                    <br />
                    By continuing, you agree to our{' '}
                    <Link to="/termsandconditions" className="text-primary underline">
                        Terms and Conditions
                    </Link>
                </p>

            </AuthCard>
        </div>
    );
};

export default EmailOtpForm;