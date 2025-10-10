import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Users, UserCheck, BookOpenCheck, DollarSign } from 'lucide-react';
import PlatformFeeCard from './PlatformFeeCard';
import LoadingAnimation from '../ui/LoadingAnimation';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Reusable Stat Card Component (no changes needed)
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className={`p-4 rounded-lg mr-4 ${color}`}>
            <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);


const MainContentA = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL ;

     const currencySymbols = {
        USD: '$',
        INR: '₹',
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { token } = JSON.parse(localStorage.getItem('facultyInfo')); // Assuming admin logs in via faculty route
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axiosInstance.get(`/api/admin/stats`, config);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [API_URL]);

    // --- Helper function to format chart data ---
    const formatWeeklyBookings = (data = []) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = new Array(7).fill(0);
        data.forEach(item => {
            // MongoDB dayOfWeek starts at 1 (Sun), so we adjust for a Mon-first week
            const dayIndex = (item._id + 5) % 7; // This shifts Sunday (1) to the end
            chartData[dayIndex] = item.count;
        });
        return {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Student Bookings This Week',
                data: chartData,
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            }],
        };
    };

    const formatMonthlySignups = (data = []) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const last6Months = [...Array(6)].map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return months[d.getMonth()];
        }).reverse();
        
        const chartData = new Array(6).fill(0);
        data.forEach(item => {
            const monthName = months[item._id - 1];
            const index = last6Months.indexOf(monthName);
            if (index > -1) {
                chartData[index] = item.count;
            }
        });

        return {
            labels: last6Months,
            datasets: [{
                label: 'New Student Signups',
                data: chartData,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
            }],
        };
    };

    if (loading) return  <LoadingAnimation />;


    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
   <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>
                <p className="text-slate-500 mt-1">A high-level view of the platform's activity.</p>
            </header>

            {stats && (
                <>
                    {/* --- MODIFIED: Top Stat Cards --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} icon={Users} color="bg-blue-500" />
                        <StatCard title="Registered Faculty" value={stats.totalFaculty.toLocaleString()} icon={UserCheck} color="bg-indigo-500" />
                        <StatCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={BookOpenCheck} color="bg-emerald-500" />
                        
                        {/* --- Dynamically render revenue cards for each currency --- */}
                        {stats.revenueByCurrency && stats.revenueByCurrency.map(revenue => (
                            <StatCard
                                key={revenue._id} // The currency code, e.g., 'USD'
                                title={`Total Revenue (${revenue._id})`}
                                value={`${currencySymbols[revenue._id] || ''}${revenue.total.toLocaleString()}`}
                                icon={DollarSign}
                                color="bg-amber-500"
                            />
                        ))}
                        <PlatformFeeCard />
                        
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Student Bookings</h2>
                            <Line options={chartOptions} data={formatWeeklyBookings(stats.weeklyBookings)} />
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">New Student Signups</h2>
                            <Bar options={chartOptions} data={formatMonthlySignups(stats.monthlySignups)} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MainContentA;