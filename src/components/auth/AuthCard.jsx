// components/auth/AuthCard.jsx

const AuthCard = ({ children }) => {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 lg:px-16 py-10 md:py-14">
      <div className="w-full max-w-md font-urbanist">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
