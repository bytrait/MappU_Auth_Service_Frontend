const Button = ({ children, type = 'button', onClick, disabled, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
className={`bg-primary text-white font-semibold px-4 py-4 rounded-md text-sm  disabled:opacity-50 hover:opacity-90 ${className} disabled:cursor-not-allowed cursor-pointer`}    >
      {children}
    </button>
  );
};

export default Button;
