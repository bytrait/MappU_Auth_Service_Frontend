// components/common/ImageSection.jsx

const ImageSection = ({ image, children }) => {
  return (
    <div className="hidden md:flex w-1/2 h-screen p-4">
      <div className="relative w-full h-full rounded-3xl overflow-hidden">
        <img
          src={image}
          alt="Auth Visual"
          className="w-full h-full object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute bottom-6 left-6 right-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;