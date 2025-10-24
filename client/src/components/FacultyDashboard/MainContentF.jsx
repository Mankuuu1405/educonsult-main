import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { DollarSign, BookCheck, Users, TrendingUp, Star, Wallet, Download } from 'lucide-react';
import LoadingAnimation from '../ui/LoadingAnimation';
import { useToast } from '../../contexts/ToastContext';


const StatCard = ({ icon: Icon, title, value, color, subValue }) => (
    <div className={`p-6 rounded-2xl shadow-lg ${color ? `bg-gradient-to-br ${color} text-white` : 'bg-white text-gray-800'}`}>
        <h2 className={`font-semibold ${color ? 'opacity-90' : 'text-gray-500'}`}>{title}</h2>
        <p className="text-4xl font-bold mt-2">{value}</p>
        {subValue && (
            <div className={`flex items-center text-sm mt-1 ${color ? 'opacity-80' : 'text-gray-500'}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{subValue}</span>
            </div>
        )}
    </div>
);

const WalletBalanceCard = ({ walletData }) => {
    const { addToast } = useToast();
    const currencySymbols = { USD: '$', INR: '₹' };
    const newi=localStorage.getItem('facultyInfo')
    // Note: Assuming a single currency (USD) for simplicity here.
    // This can be expanded to handle multiple currencies like in the admin dashboard.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [withdrawalData, setWithdrawalData] = useState({
        amount: '',
        currency: 'USD', // Default currency
        paymentDetails: {
            type: 'bank',
            accountHolder: '',
            accountNo: '',
            ifsc: ''
        }
    });

   console.log(newi)
    const handleWithdrawalSubmit = async () => {
     const amount = parseFloat(withdrawalData.amount);
    if (isNaN(amount) || amount <= 0) {
        addToast('Please enter a valid positive amount.', 'error');
        return;
    }
    if (!withdrawalData.paymentDetails.accountHolder || !withdrawalData.paymentDetails.accountNo) {
        addToast('Please fill in all payment details.', 'error');
        return;
    }

     const walletForCurrency = walletData.find(wallet => wallet.currency === withdrawalData.currency);
    if (!walletForCurrency || amount > walletForCurrency.amount) {
        addToast('Insufficient Funds In Your Wallet', 'error');
        return;
    }
    try {
        // 2. Get authentication token from localStorage
        // const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
        // if (!token) {
        //     addToast('Authentication error. Please log in again.', 'error');
        //     return;
        // }
        
        // 3. Configure headers for the API request
        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //     },
        // };

        // 4. Make the POST request to the backend
        await axiosInstance.post(
            '/api/faculty/withdrawals', // Your API endpoint
            withdrawalData,               // The data from the form
                               // The authorization headers
        );

        // 5. Handle success
        addToast('Withdrawal request submitted successfully!', 'success');
        setIsModalOpen(false); // Close the modal
        // Optional: Reset the form state
        setWithdrawalData({
            amount: '',
            currency: 'USD',
            paymentDetails: { type: 'bank', accountHolder: '', accountNo: '', ifsc: '' }
        });

    } catch (error) {
        // 6. Handle errors from the API
        // This will display specific messages like "Insufficient funds." from your backend
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
        addToast(errorMessage, 'error');
    }
};


    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Wallet className="h-6 w-6 mr-3 text-indigo-500" />
                <span>Your Wallet</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-center">
                {/* --- MODIFIED: Display balances for each currency --- */}
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {walletData.length > 0 ? walletData.map(wallet => (
                        <div key={wallet.currency}>
                            <p className="text-sm font-medium text-gray-500">Available ({wallet.currency})</p>
                            <p className="text-4xl font-bold text-gray-800 tracking-tight">
                                {currencySymbols[wallet.currency]}{wallet.amount.toFixed(2)}
                            </p>
                        </div>
                    )) : (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Available to Withdraw</p>
                            <p className="text-4xl font-bold text-gray-800 tracking-tight">$0.00</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 sm:mt-0 flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw Funds
                </button>
            </div>
            {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Withdrawal</h2>
            {/* Form fields for amount, currency, payment details */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Amount (USD)</label>
                    <input 
                        type="number"
                        placeholder="e.g., 250.00"
                        className="w-full mt-1 p-3 border rounded-lg"
                        value={withdrawalData.amount}
                        onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})}
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600">Account Holder Name</label>
                    <input 
                        type="text"
                        className="w-full mt-1 p-3 border rounded-lg"
                        value={withdrawalData.paymentDetails.accountHolder}
                        onChange={(e) => setWithdrawalData({...withdrawalData, paymentDetails: {...withdrawalData.paymentDetails, accountHolder: e.target.value}})}
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600">Account Number</label>
                    <input 
                        type="text"
                        className="w-full mt-1 p-3 border rounded-lg"
                         value={withdrawalData.paymentDetails.accountNo}
                        onChange={(e) => setWithdrawalData({...withdrawalData, paymentDetails: {...withdrawalData.paymentDetails, accountNo: e.target.value}})}
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button onClick={handleWithdrawalSubmit} className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">Submit Request</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};


const MainContentF = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;
    const currencySymbols = { USD: '$', INR: '₹' };


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axiosInstance.get(`/api/faculty/me/dashboard-stats`, config);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [API_URL]);

    if (loading) return <LoadingAnimation />;
    if (!stats) return <div className="p-8 text-center">Could not load dashboard data.</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-gray-800">My Dashboard</h1>
                <p className="text-gray-500 mt-1">Your earnings and activity at a glance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.totalEarnings.map(earning => {
                    const weekly = stats.weeklyEarnings.find(w => w._id === earning._id)?.total || 0;
                    return (
                        <StatCard
                            key={earning._id}
                            title={`Total Earnings (${earning._id})`}
                            value={`${currencySymbols[earning._id]}${earning.total.toFixed(2)}`}
                            subValue={`+ ${currencySymbols[earning._id]}${weekly.toFixed(2)} this week`}
                            color="from-indigo-500 to-blue-500"
                        />
                    );
                })}
                <StatCard icon={BookCheck} title="Completed Chats" value={stats.completedChats} />
                <StatCard icon={Users} title="Unique Students" value={stats.uniqueStudents} />
                <StatCard icon={Star} title="Average Rating" value={`${stats.averageRating} / 5.0`} />
            </div>
            <div className="mb-10">
                <WalletBalanceCard walletData={stats.availableToWithdraw} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Chat Earnings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2">
                                <th className="p-3 text-sm font-semibold text-gray-500">Student</th>
                                <th className="p-3 text-sm font-semibold text-gray-500">Topic</th>
                                <th className="p-3 text-sm font-semibold text-gray-500">Date</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 text-right">Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentChatEarnings.map(chat => (
                                <tr key={chat.id} className="border-b hover:bg-slate-50">
                                    <td className="p-3 font-medium text-gray-700">{chat.student}</td>
                                    <td className="p-3 text-gray-600">{chat.topic}</td>
                                    <td className="p-3 text-gray-500">{new Date(chat.date).toLocaleDateString()}</td>
                                    <td className="p-3 font-bold text-green-600 text-right">
                                        {currencySymbols[chat.currency]}{chat.earnings.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MainContentF;