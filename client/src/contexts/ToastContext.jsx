import React, { createContext, useState, useContext, useCallback,useRef, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { gsap } from 'gsap';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

// The Toast UI Component
const Toast = ({ message, type, onRemove }) => {
    const toastRef = useRef(null);

    const icons = {
        success: <CheckCircle className="text-green-500" />,
        error: <AlertTriangle className="text-red-500" />,
        info: <Info className="text-blue-500" />,
    };

    useEffect(() => {
        gsap.fromTo(toastRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
        const timer = setTimeout(() => {
            gsap.to(toastRef.current, {
                opacity: 0, x: 100, duration: 0.4, ease: 'power3.in', onComplete: onRemove
            });
        }, 4000); // Toast disappears after 4 seconds

        return () => clearTimeout(timer);
    }, [onRemove]);

    return (
        <div ref={toastRef} className="bg-white rounded-lg shadow-2xl p-4 flex items-start max-w-sm w-full border-l-4"
             style={{ borderColor: type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6' }}>
            <div className="mr-3 flex-shrink-0">{icons[type]}</div>
            <div className="flex-grow text-gray-700">{message}</div>
            <button onClick={onRemove} className="ml-4 p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
            </button>
        </div>
    );
};


// The Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Container for displaying toasts */}
            <div className="fixed top-5 right-5 z-[100] space-y-3">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};