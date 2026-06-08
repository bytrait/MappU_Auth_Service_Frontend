import React from 'react';
import EmailOtpForm from '../components/auth/EmailOtpForm';

const Login = () => {
  return (
    <div className="bg-[#012A9E] p-4 md:p-6 min-h-screen flex items-center justify-center">
      <EmailOtpForm />
    </div>
  );
};

export default Login;
