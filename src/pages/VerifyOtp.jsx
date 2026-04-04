import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { verifyOtp, getProfile } from '../api/authService';
import Input from '../components/UI/Input';

const VerifyOtp = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      await verifyOtp({
        email: state.email,
        otp,
        fullName,
        contact,
        role,
      });

      const res = await getProfile(); // Auth via cookie
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="card">
      <h2>Verify OTP</h2>
      <Input label="OTP" value={otp} onChange={e => setOtp(e.target.value)} />
      <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
      <Input label="Contact" value={contact} onChange={e => setContact(e.target.value)} />
      <Input label="Role" value={role} onChange={e => setRole(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>

      {user && <p className="success">Welcome, {user.fullName} 🎉</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VerifyOtp;
