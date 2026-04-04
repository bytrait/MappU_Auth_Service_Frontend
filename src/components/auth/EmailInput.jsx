// src/components/auth/EmailInput.jsx

import Input from "../UI/Input";

const EmailInput = ({ email, setEmail }) => {
  return (
    <div className="mb-4">
      <Input
        type="email"
        placeholder="Enter your email"
        label="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
};

export default EmailInput;
