// components/auth/AuthHeader.jsx

const AuthHeader = ({ logo, page }) => {
  return (
    <div className="text-center mb-6">
      <img src={logo} alt="Logo" className="h-16 mx-auto mb-6" />

      <h2 className="text-2xl text-default font-semibold">
        {page} to your MapU account
      </h2>

      <p className="text-muted text-sm mt-1">
        Guiding your journey from ambition to achievement.
      </p>
    </div>
  );
};

export default AuthHeader;