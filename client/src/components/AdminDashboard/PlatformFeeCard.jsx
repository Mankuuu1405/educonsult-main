import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { Percent, Save } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const PlatformFeeCard = () => {
    const [fee, setFee] = useState('');
    const [initialFee, setInitialFee] = useState('');
    const [message, setMessage] = useState('');
    const { addToast } = useToast(); 
    const API_URL = process.env.REACT_APP_API_URL ;

    useEffect(() => {
        const fetchFee = async () => {
            try {
                const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axiosInstance.get(`/api/admin/settings/platform-fee`, config);
                setFee(data.platformFeePercentage);
                setInitialFee(data.platformFeePercentage);
            } catch (error) {
                console.error("Failed to fetch platform fee");
            }
        };
        fetchFee();
    }, [API_URL]);

    const handleSaveFee = async () => {
        try {
            const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axiosInstance.put(`/api/admin/settings/platform-fee`, { percentage: parseFloat(fee) }, config);
            setInitialFee(fee);
            setMessage('Fee updated!');
            setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
        } catch (error) {
            // alert('Failed to update fee.');
            addToast('Failed to update fee.', 'error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
                <div className="p-4 rounded-lg mr-4 bg-rose-500">
                    <Percent className="h-7 w-7 text-white" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Platform Fee</p>
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="number"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            className="text-2xl font-bold text-slate-800 w-24 p-1 border-b-2 focus:outline-none focus:border-rose-500"
                        />
                        <span className="text-2xl font-bold text-slate-800">%</span>
                    </div>
                </div>
            </div>
            {fee !== initialFee && (
                <button
                    onClick={handleSaveFee}
                    className="w-full mt-4 flex items-center justify-center bg-rose-500 text-white font-semibold py-2 rounded-lg hover:bg-rose-600 transition-colors"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Fee
                </button>
            )}
            {message && <p className="text-sm text-green-600 text-center mt-2">{message}</p>}
        </div>
    );
};

export default PlatformFeeCard;