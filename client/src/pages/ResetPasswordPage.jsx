import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Lock } from 'lucide-react';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError('');
        setMessage('');

        try {
            const { data } = await axiosInstance.put(`/api/auth/reset-password/${token}`, { password });
            setMessage(data.message);
            setTimeout(() => navigate('/student/login'), 3000); // Redirect to login after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div className="min-h-screen bg-light-bg flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-serif font-bold text-primary text-center mb-4">Set New Password</h1>
                {message && <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-lg text-center mb-4">{message}</div>}
                {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center mb-4">{error}</div>}

                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">New Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full px-4 py-3 pl-10 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-accent" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">Confirm New Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="block w-full px-4 py-3 pl-10 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-accent" />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 text-white font-bold bg-primary rounded-lg hover:bg-primary-light transition-colors shadow-md">
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;