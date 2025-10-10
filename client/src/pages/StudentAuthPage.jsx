import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Send } from 'lucide-react';
import { gsap } from 'gsap';
import axiosInstance from '../api/axios';
import Navbar from '../components/homepage/Navbar';
import OtpForm from '../components/ui/OtpForm';
import BookLoader from '../components/ui/BookLoader'; // <--- 1. IMPORT THE LOADER

// --- VISUALS for Student Page (No Changes) ---
const studentImages = [
    { name: 'Collaborative Study Session', imgSrc: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070' },
    { name: 'Graduation Day', imgSrc: 'https://images.unsplash.com/photo-1531030874896-fdef6826f2f7?q=80&w=2070' },
    { name: 'Focused Learning', imgSrc: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071' },
];

const VisualCard = ({ name, imgSrc }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg flex flex-col items-center text-center">
        <img src={imgSrc} alt={name} className="w-full h-48 object-cover rounded-xl mb-3" />
        <p className="font-sans text-text-secondary text-sm font-semibold">{name}</p>
    </div>
);

// --- InputField component (No Changes) ---
const InputField = ({ id, type, label, icon: Icon, value, onChange }) => (
    <div className="relative">
        <input
            id={id}
            name={id}
            type={type}
            placeholder=" "
            className="block w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-border-color rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-accent peer transition-colors"
            value={value}
            onChange={onChange}
            required
        />
        <label htmlFor={id} className="absolute text-base text-text-secondary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 left-10 peer-focus:px-2 peer-focus:text-accent peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">{label}</label>
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary peer-focus:text-accent transition-colors" />
    </div>
);

const StudentAuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoginView, setIsLoginView] = useState(location.pathname.includes('/login'));

    const [step, setStep] = useState('details');
    const [view, setView] = useState('login');
    const [loading, setLoading] = useState(false); // <--- 2. ADD LOADING STATE

    // Form fields state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const formContainerRef = useRef(null);
    const headingRef = useRef(null);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        setIsLoginView(location.pathname.includes('/login'));
        setStep('details');
        setView('login');
        setFullName('');
        setEmail('');
        setPassword('');
        setError('');
        setMessage('');
    }, [location.pathname]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // <--- 3. SET LOADING TO TRUE
        try {
            const { data } = await axiosInstance.post(`/api/auth/student/login`, { email, password });
            localStorage.setItem('studentInfo', JSON.stringify(data));
            navigate('/browse');
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.needsVerification) {
                setError(errorData.message);
                setStep('otp');
            } else {
                setError(errorData?.message || 'An error occurred during login.');
            }
        } finally {
            setLoading(false); // <--- 3. SET LOADING TO FALSE
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // <--- 3. SET LOADING TO TRUE
        try {
            await axiosInstance.post(`/api/auth/student/signup`, { fullName, email, password });
            setStep('otp');
        } catch (err) {
             const errorResponse = err.response?.data;

        if (errorResponse && errorResponse.errors) {
            // If the backend sent a validation errors array, display the first one.
            setError(errorResponse.errors[0].msg);
        } else {
            // Otherwise, show the general message from the backend or a default one.
            setError(errorResponse?.message || 'An error occurred during signup.');
        }
        } finally {
            setLoading(false); // <--- 3. SET LOADING TO FALSE
        }
    };

    const handleOtpVerify = async (otp) => {
        setError('');
        setLoading(true);
        try {
            const { data: userData } = await axiosInstance.post('/api/auth/verify-otp', { email, otp });
            localStorage.setItem('studentInfo', JSON.stringify(userData));
            window.location.href = '/student-dashboard'; // Or just '/'
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const { data } = await axiosInstance.post(`/api/auth/forgot-password`, { email });
            setMessage(data.message);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startOver = () => {
        setStep('details');
        setError('');
    };

    return (
        <div className="min-h-screen bg-light-bg grid grid-cols-1 lg:grid-cols-2">
            <Navbar />
            <div className="flex flex-col justify-center items-center p-8 lg:p-12">
                {/* --- 4. CONDITIONAL RENDERING --- */}
                {loading ? (
                    <BookLoader />
                ) : step === 'details' ? (
                    <div className="w-full max-w-md">
                        <div ref={headingRef}>
                            {view === 'login' && isLoginView && (<>
                                <h1 className="text-4xl font-serif font-bold text-primary">Welcome Back, Student!</h1>
                                <p className="mt-3 text-text-secondary">Sign in to connect with your mentors.</p>
                            </>)}
                            {!isLoginView && (<>
                                <h1 className="text-4xl font-serif font-bold text-primary">Start Your Journey</h1>
                                <p className="mt-3 text-text-secondary">Create an account to unlock world-class guidance.</p>
                            </>)}
                            {view === 'forgotPassword' && (<>
                                <h1 className="text-4xl font-serif font-bold text-primary">Reset Password</h1>
                                <p className="mt-3 text-text-secondary">Enter your email to receive a password reset link.</p>
                            </>)}
                        </div>

                        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">{error}</div>}
                        {message && <div className="mt-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-lg">{message}</div>}

                        <div ref={formContainerRef} className="mt-8 space-y-6">
                            {isLoginView && view === 'login' && (
                                <form className="space-y-6" onSubmit={handleLoginSubmit}>
                                    <InputField id="email" type="email" label="Email Address" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <InputField id="password" type="password" label="Password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <div className="text-right">
                                        <button type="button" onClick={() => { setView('forgotPassword'); setMessage(''); setError(''); }} className="text-sm font-semibold text-primary hover:underline">
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <button type="submit" className="w-full py-4 text-white font-bold bg-primary rounded-lg hover:bg-primary transition-colors shadow-custom">Login</button>
                                </form>
                            )}
                            {isLoginView && view === 'forgotPassword' && (
                                <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
                                    <InputField id="email" type="email" label="Your Account Email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <button type="submit" className="w-full py-4 text-white font-bold bg-primary rounded-lg hover:bg-primary-light transition-colors shadow-custom flex items-center justify-center">
                                        <Send className="w-5 h-5 mr-2" /> Send Reset Link
                                    </button>
                                </form>
                            )}
                            {!isLoginView && (
                                <form className="space-y-6" onSubmit={handleSignupSubmit}>
                                    <InputField id="fullName" type="text" label="Full Name" icon={User} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                    <InputField id="email" type="email" label="Email Address" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <InputField id="password" type="password" label="Create Password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <button type="submit" className="w-full py-4 text-white font-bold bg-primary rounded-lg hover:bg-primary transition-colors shadow-custom">Create Student Account</button>
                                </form>
                            )}
                        </div>
                        <div className="mt-6 text-center text-text-secondary">
                            {view === 'login' && isLoginView && (
                                <Link to={'/student/signup'} className="font-semibold text-primary hover:underline">New here? Create an Account</Link>
                            )}
                            {view === 'forgotPassword' && (
                                <button type="button" onClick={() => { setView('login'); setMessage(''); setError(''); }} className="font-semibold text-primary hover:underline">
                                    &larr; Back to Login
                                </button>
                            )}
                            {!isLoginView && (
                                <Link to={'/student/login'} className="font-semibold text-primary hover:underline">Already registered? Login</Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <OtpForm email={email} onVerify={handleOtpVerify} error={error} onStartOver={startOver} />
                )}
            </div>

            {/* Visuals Column (No Changes) */}
            <div className="hidden lg:block relative bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-accent/5"></div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="w-[500px] h-[700px] flex gap-4 -rotate-3 transform">
                        <div className="w-1/2 space-y-4"><div className="animate-scroll-up space-y-4">{[...studentImages, ...studentImages].map((p, i) => <VisualCard key={`c1-${i}`} {...p} />)}</div></div>
                        <div className="w-1/2 space-y-4 pt-16"><div className="animate-scroll-down space-y-4">{[...studentImages.slice().reverse(), ...studentImages.slice().reverse()].map((p, i) => <VisualCard key={`c2-${i}`} {...p} />)}</div></div>
                    </div>
                </div>
                <div className="absolute bottom-12 left-12 right-12 bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
                    <h2 className="text-2xl font-serif font-bold text-primary">Your Next Breakthrough Awaits</h2>
                    <p className="mt-2 text-text-secondary">Gain access to a curated network of experts dedicated to your growth.</p>
                </div>
            </div>
        </div>
    );
};

export default StudentAuthPage;