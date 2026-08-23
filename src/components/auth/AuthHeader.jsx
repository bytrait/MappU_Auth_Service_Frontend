// components/auth/AuthHeader.jsx

const AUTH_HEADLINE = 'ByTrait Career Psychometric Assessment';
const AUTH_SUBHEADLINE = 'Discover Your True Potential';

const AuthHeader = ({
  logo,
  headline = AUTH_HEADLINE,
  subheadline = AUTH_SUBHEADLINE,
}) => {
  return (
    <div className="text-center mb-8">
      {logo && (
        <img src={logo} alt="Logo" className="h-16 mx-auto mb-8" />
      )}

      <h2 className="font-playfair text-3xl md:text-[2rem] text-default font-semibold leading-snug tracking-tight">
        {headline}
      </h2>

      <p className="font-urbanist text-muted text-base mt-3 leading-relaxed">
        {subheadline}
      </p>
    </div>
  );
};

export { AUTH_HEADLINE, AUTH_SUBHEADLINE };
export default AuthHeader;
