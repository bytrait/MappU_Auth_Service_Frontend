import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmailInput from '../components/auth/EmailInput';
import OtpInput from '../components/auth/OtpInput';
import Button from '../components/UI/Button';
import logo from '../assets/bytrait_logo.png';
import rightTop from '../assets/image1.png';
import rightBottom from '../assets/image2.png';
import { sendLoginOtp, verifyLoginOtp } from '../api/authService';
import { toast } from 'sonner';
import { platformRedirectUrl } from '../tenant/slug';
import { useTenant } from '../tenant/TenantContext';

const RESEND_OTP_TIMEOUT = 300; // 5 minutes
const RESEND_STORAGE_KEY = 'otp_last_sent';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const tenant = useTenant();

    const navigate = useNavigate();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isOtpValid = (otp) => /^\d{6}$/.test(otp);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await sendLoginOtp({ email });
            const now = Date.now();
            localStorage.setItem(RESEND_STORAGE_KEY, now.toString());
            setOtpSent(true);
            setResendTimer(RESEND_OTP_TIMEOUT);
            toast.success('OTP sent successfully. Please check your email.');
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
            const role = res?.data?.user?.role;

            toast.success('Login successful');
            localStorage.removeItem(RESEND_STORAGE_KEY);

            // Redirect based on role (tenant-aware)
            if (role === 'STUDENT') {
              window.location.href = platformRedirectUrl(tenant?.code, '/');
            } else if (role === 'COUNSELLOR') {
              window.location.href = platformRedirectUrl(
                tenant?.code,
                '/counsellor/dashboard'
              );
            } else if (role === 'INSTITUTION') {
              window.location.href = platformRedirectUrl(
                tenant?.code,
                '/institution/students'
              );
            } else navigate('/');
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // On mount: restore resend timer from localStorage
    useEffect(() => {
        const lastSent = localStorage.getItem(RESEND_STORAGE_KEY);
        if (lastSent) {
            const elapsed = Math.floor((Date.now() - Number(lastSent)) / 1000);
            if (elapsed < RESEND_OTP_TIMEOUT) {
                setOtpSent(true);
                setResendTimer(RESEND_OTP_TIMEOUT - elapsed);
            }
        }
    }, []);

    // Timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    return (
        <div className="min-h-screen flex items-center">
            <div className="container mx-auto">
                <div className="flex flex-wrap">
                    {/* Left side */}
                    <div className="w-full md:w-5/12 p-8">
                        <div className="mb-6">
                            <img src={logo} alt="ByTrait Logo" className="w-60 mb-4" />
                            <h1 className="text-2xl font-semibold mb-2">Log In</h1>
                        </div>

                        <EmailInput email={email} setEmail={setEmail} />

                        {!otpSent && (
                            <Button
                                type="button"
                                className="w-full mt-4"
                                onClick={handleSendOtp}
                                disabled={!isValidEmail(email) || loading}
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                        )}

                        {otpSent && (
                            <>
                                <OtpInput otp={otp} setOtp={setOtp} />
                                <div className="flex justify-between items-center mb-4 text-sm">
                                    {resendTimer > 0 ? (
                                        <span className="text-gray-500">
                                            Resend OTP in {Math.floor(resendTimer / 60)
                                                .toString()
                                                .padStart(2, '0')}:
                                            {(resendTimer % 60).toString().padStart(2, '0')}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={handleSendOtp}
                                            className="text-blue-600 hover:underline"
                                            disabled={loading}
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    className="w-full mt-4"
                                    onClick={handleLogin}
                                    disabled={loading || !isOtpValid(otp)}
                                >
                                    {loading ? 'Verifying...' : 'Login'}
                                </Button>
                            </>
                        )}

                        <div className="mt-4 text-center text-sm text-gray-600">
                            <span>or </span>
                            <Link to="/register/student" className="text-blue-600 hover:underline">
                                Create new account
                            </Link>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:block md:w-7/12 relative">
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

export default Login;
