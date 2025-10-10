import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';

const OtpForm = ({ email, onVerify, error, onStartOver }) => {
    const [otp, setOtp] = useState('');
    const formRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }, []);

    const handleOtpSubmit = (event) => {
        event.preventDefault();
        onVerify(otp);
    };

    return (
        <div ref={formRef} className="w-full max-w-md">
            <h2 className="text-4xl font-serif font-bold text-primary text-center">Verify Your Email</h2>
            <p className="mt-3 text-text-secondary text-center">Enter the 6-digit code sent to<br /><strong>{email}</strong></p>
            
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">{error}</div>}
            
            <form className="space-y-6 mt-8" onSubmit={handleOtpSubmit}>
                <div className="relative">
                    <ShieldCheck className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="_ _ _ _ _ _"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-center tracking-[1em] font-mono text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 font-semibold rounded-xl hover:scale-105 transform transition-transform hover:shadow-lg">
                    Verify Account
                </button>
                <div className="text-center text-text-secondary">
                    <button type="button" onClick={onStartOver} className="text-blue-600 font-medium hover:underline cursor-pointer">
                        Didn't get a code? Start Over
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OtpForm;