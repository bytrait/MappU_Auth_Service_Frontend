import Input from "../UI/Input";

const OtpInput = ({ otp, setOtp }) => {
  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Enter OTP"
        label="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
    </div>
  );
};

export default OtpInput;
