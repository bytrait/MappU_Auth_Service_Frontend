import { useEffect } from 'react';

const Toast = ({ type = 'success', message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseStyle = 'fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-md text-white text-sm';
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className={`${baseStyle} ${bgColor}`}>
            {message}
        </div>
    );
};

export default Toast;
