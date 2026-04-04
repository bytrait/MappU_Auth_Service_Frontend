const Input = ({ label, type = 'text', error, className = '', ...rest }) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-sm mb-1 text-muted">{label}</label>}
      <input
        type={type}
        className={`w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-primary ${className}`}
        {...rest} // important: spreads register()
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
