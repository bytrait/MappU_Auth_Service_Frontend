// components/auth/AuthCard.jsx

const AuthCard = ({ children }) => {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;