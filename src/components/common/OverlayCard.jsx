// components/common/OverlayCard.jsx

const OverlayCard = () => {
return (
    <div className="bg-white/20 backdrop-blur-lg text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-semibold mb-2">
            Have a question? We’re here to help.
        </h3>

        <p className="text-sm opacity-90">
            Phone: +91 8287795809, +91 7014537715 | Email: contact@mappmyuniversity.com | Website: www.mappmyuniversity.com
        </p>
    </div>
);
};

export default OverlayCard;