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
    // Note: Assuming a single currency (USD) for simplicity here.
    // This can be expanded to handle multiple currencies like in the admin dashboard.

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
                    onClick={() => addToast('Withdrawal requests will be managed by the admin!')}
                    className="mt-4 sm:mt-0 flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw Funds
                </button>
            </div>
        </div>
    );
};


const MainContentF = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL ;
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