import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
    UsersIcon,
    AcademicCapIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MainContentA = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        registeredFaculty: 0,
        totalBookings: 0,
        revenue: 0,
        platformFees: 0
    });

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        monthlySignups: [],
        weeklyBookings: [],
        setting:[], 
        totalStudents: 0,
        totalFaculty: 0,
        totalBookings: 0,
    });
    const [revenueByCurrency, setRevenueByCurrency] = useState({ USD: 0, INR: 0 });
    const [settings, setSettings] = useState(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await axios({
                    method: 'get',
                    url: 'http://localhost:5000/api/admin/stats',
                    withCredentials: true
                });
                
                setData(result.data);
               
                const settingsPromise = axios({
                    method: 'get',
                    url: 'http://localhost:5000/api/admin/settings/platform-fee',
                    withCredentials: true
                });

                const [statsResult, settingsResult] = await Promise.all([result, settingsPromise]);

                const processedRevenue = { USD: 0, INR: 0 };
                if (result.data.revenueByCurrency) {
                    result.data.revenueByCurrency.forEach(item => {
                        if (processedRevenue.hasOwnProperty(item._id)) {
                             processedRevenue[item._id] = item.total;
                        }
                    });
                }
                setRevenueByCurrency(processedRevenue);
                
                setStats({
                    totalStudents: result.data.totalStudents,
                    registeredFaculty: result.data.totalFaculty,
                    totalBookings: result.data.totalBookings,
                    revenue: processedRevenue.USD,
                    platformFees: 12543
                });
                setSettings(settingsResult.data);
                setLoading(false);
                
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Handle payment export download
    const handleDownloadPayments = async () => {
        try {
            setIsDownloading(true);
            
            const response = await axios({
                method: 'get',
                url: 'http://localhost:5000/api/admin/export-payments',
                responseType: 'blob',
                withCredentials: true
            });

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Get current month/year for filename
            const date = new Date();
            const monthYear = date.toISOString().slice(0, 7);
            link.setAttribute('download', `Faculty_Payments_${monthYear}.xlsx`);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setIsDownloading(false);
        } catch (error) {
            console.error('Error downloading payment report:', error);
            alert('Failed to download payment report. Please try again.');
            setIsDownloading(false);
        }
    };

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyCounts = new Array(7).fill(0);
    
    data.weeklyBookings.forEach(bookingData => {
        const dayIndex = bookingData._id - 1;
        if (dayIndex >= 0 && dayIndex < 7) {
            weeklyCounts[dayIndex] = bookingData.count;
        }
    });

    const weeklyBookingsData = {
        labels: dayLabels,
        datasets: [
            {
                label: 'Bookings',
                data: weeklyCounts,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const handleUpdateSettings = async (updatedData) => {
        try {
            const result = await axios({
                method: 'put',
                url: 'http://localhost:5000/api/admin/settings/platform-fee',
                data: updatedData,
                withCredentials: true
            });
            setSettings(result.data);
            setIsSettingsModalOpen(false);
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCounts = new Array(12).fill(0);
    
    data.monthlySignups.forEach(signupData => {
        const monthIndex = signupData._id - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            monthlyCounts[monthIndex] = signupData.count;
        }
    });

    const monthlySignupsData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'New Students',
                data: monthlyCounts,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => (
        <div className="admin-stats-card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-admin-600">{title}</p>
                    <p className="text-2xl font-bold text-admin-900">{value.toLocaleString()}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            {trend === 'up' ? (
                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trendValue}%
                            </span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="admin-loading"></div>
            </div>
        );
    }

    const SettingsModal = ({ isOpen, onClose, currentSettings, onSave }) => {
        const [fee, setFee] = useState(0);
        const [payoutDate, setPayoutDate] = useState('');

        useEffect(() => {
            if (currentSettings) {
                setFee(currentSettings.platformFeePercentage);
                
                if (currentSettings.payoutDate) {
                    setPayoutDate(new Date(currentSettings.payoutDate).toISOString().split('T')[0]);
                } else {
                    setPayoutDate('');
                }
            }
        }, [currentSettings]);

        if (!isOpen) return null;

        const handleSave = () => {
            onSave({ platformFeePercentage: fee, payoutDate });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold text-admin-900 mb-4">Platform Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="platformFee" className="block text-sm font-medium text-admin-700">Platform Fee Percentage (%)</label>
                            <input
                                type="number"
                                id="platformFee"
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="payoutDate" className="block text-sm font-medium text-admin-700">Next Payout Date</label>
                            <input
                                type="date"
                                id="payoutDate"
                                value={payoutDate}
                                onChange={(e) => setPayoutDate(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={onClose} className="admin-button-secondary">Cancel</button>
                        <button onClick={handleSave} className="admin-button-primary">Save Changes</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-admin-900">Dashboard Overview</h1>
                <p className="text-admin-600">Monitor your platform's performance and key metrics</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={UsersIcon}
                    trend="up"
                    trendValue="12.5"
                    color="blue"
                />
                <StatCard
                    title="Registered Faculty"
                    value={stats.registeredFaculty}
                    icon={AcademicCapIcon}
                    trend="up"
                    trendValue="8.2"
                    color="green"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={CalendarDaysIcon}
                    trend="up"
                    trendValue="15.3"
                    color="purple"
                />
                <StatCard
                    title="Revenue (USD)"
                    value={`$${stats.revenue.toLocaleString()}`}
                    icon={CurrencyDollarIcon}
                    trend="up"
                    trendValue="22.1"
                    color="yellow"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Bookings Chart */}
                <div className="admin-chart-container">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-admin-900">Weekly Bookings</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                            <span className="text-sm text-admin-600">This Week</span>
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={weeklyBookingsData} options={chartOptions} />
                    </div>
                </div>

                {/* Monthly Signups Chart */}
                <div className="admin-chart-container">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-admin-900">Monthly Signups</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-admin-600">Last 6 Months</span>
                        </div>
                    </div>
                    <div className="h-64">
                        <Bar data={monthlySignupsData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Platform Fee Tracking */}
            <div className="admin-chart-container">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-admin-900">Platform Fee Tracking</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary-600">USD Revenue</p>
                                <p className="text-xl font-bold text-primary-900">
                                    ${revenueByCurrency.USD.toLocaleString()}
                                </p>
                            </div>
                            <CurrencyDollarIcon className="h-8 w-8 text-primary-400" />
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm text-green-600">INR Revenue</p>
                                <p className="text-xl font-bold text-green-900">
                                    ₹{revenueByCurrency.INR.toLocaleString()}
                                </p>
                            </div>
                            <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
                        </div>
                    </div>

                    <button onClick={() => setIsSettingsModalOpen(true)} className="bg-yellow-50 p-4 rounded-lg text-left hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Platform Fee Rate</p>
                                <p className="text-xl font-bold text-yellow-900">{settings?.platformFeePercentage}%</p>
                            </div>
                            <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-400" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-card">
                <h3 className="text-lg font-semibold text-admin-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="admin-button-primary p-4 text-left">
                        <div className="flex items-center space-x-3">
                            <UsersIcon className="h-6 w-6" />
                            <div>
                                <p className="font-medium">Manage Faculty</p>
                                <p className="text-sm opacity-90">View and manage faculty members</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => setIsSettingsModalOpen(true)} className="admin-button-secondary p-4 text-left">
                        <div className="flex items-center space-x-3">
                            <CalendarDaysIcon className="h-6 w-6" />
                            <div>
                                <p className="font-medium">Set Next Payout Date</p>
                                <p className="text-sm opacity-90">
                                    Current: {settings && settings.payoutDate ? new Date(settings.payoutDate).toLocaleDateString() : 'Not Set'}
                                </p>
                            </div>
                        </div>
                    </button>

                    <button 
                        onClick={handleDownloadPayments} 
                        disabled={isDownloading}
                        className="admin-button-secondary p-4 text-left disabled:opacity-50 disabled:cursor-not-allowed bg-green-300"
                    >
                        <div className="flex items-center space-x-3">
                            <ArrowDownTrayIcon className="h-6 w-6" />
                            <div>
                                <p className="font-medium">
                                    {isDownloading ? 'Downloading...' : "This Month's Payments"}
                                </p>
                                <p className="text-sm opacity-90">Download payment Excel report</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                currentSettings={settings}
                onSave={handleUpdateSettings}
            />
        </div>
    );
};

export default MainContentA;




// import React, { useState, useEffect } from 'react';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { Line, Bar } from 'react-chartjs-2';
// import {
//     UsersIcon,
//     AcademicCapIcon,
//     CalendarDaysIcon,
//     CurrencyDollarIcon,
//     ArrowTrendingUpIcon,
//     ArrowTrendingDownIcon
// } from '@heroicons/react/24/outline';
// import axios from 'axios';

// // Register Chart.js components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// );

// const MainContentA = () => {
//     const [stats, setStats] = useState({
//         totalStudents: 0,
//         registeredFaculty: 0,
//         totalBookings: 0,
//         revenue: 0,
//         platformFees: 0
//     });

//     const [loading, setLoading] = useState(true);
//     const [data, setData] = useState({
//     monthlySignups: [],
//     weeklyBookings: [],
//     setting:[], 
//     totalStudents: 0,
//     totalFaculty: 0,
//     totalBookings: 0,

//     // Add any other properties you expect with default values
// });
//     const [revenueByCurrency, setRevenueByCurrency] = useState({ USD: 0, INR: 0 });

//     const [settings, setSettings] = useState(null);
//     const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);



//     // Mock data - replace with actual API calls
//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 // Remove the mock delay if you don't need it
//                 // await new Promise(resolve => setTimeout(resolve, 1000));

//                 const result = await axios({
//                     method: 'get',
//                     url: 'http://localhost:5000/api/admin/stats',
//                     withCredentials: true
//                 });
                
//                 setData(result.data);
               
//                   const settingsPromise = axios({
//                     method: 'get',
//                     url: 'http://localhost:5000/api/admin/settings/platform-fee',
//                     withCredentials: true
//                 });

//                 const [statsResult, settingsResult] = await Promise.all([result, settingsPromise]);

//                 // --- START: New logic to process revenue ---
//                 const processedRevenue = { USD: 0, INR: 0 }; // Set default values
//                 if (result.data.revenueByCurrency) {
//                     result.data.revenueByCurrency.forEach(item => {
//                         // The item._id holds the currency code (e.g., "USD")
//                         // The item.total holds the amount
//                         if (processedRevenue.hasOwnProperty(item._id)) {
//                              processedRevenue[item._id] = item.total;
//                         }
//                     });
//                 }
//                 setRevenueByCurrency(processedRevenue);
//                 // --- END: New logic to process revenue ---
                
//                 setStats({
//                     totalStudents: result.data.totalStudents,
//                     registeredFaculty: result.data.totalFaculty,
//                     totalBookings: result.data.totalBookings,
//                     revenue: processedRevenue.USD, // Set the main card to show USD revenue
//                     platformFees: 12543 // This appears to be a placeholder
//                 });
//                 setSettings(settingsResult.data);
//                 setLoading(false);
                
//             } catch (error) {
//                 console.error('Error fetching stats:', error);
//                 setLoading(false);
//             }
//         };

//         fetchStats();
//     }, []);

//     console.log(settings);

    
//    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    
//     const weeklyCounts = new Array(7).fill(0);

    
//     data.weeklyBookings.forEach(bookingData => {
       
//         const dayIndex = bookingData._id - 1;

//         // Check if the index is valid before assigning
//         if (dayIndex >= 0 && dayIndex < 7) {
//             weeklyCounts[dayIndex] = bookingData.count;
//         }
//     });

//     // --- 3. Update the Chart Data Object ---
//     // This object now uses the dynamic data you just processed
//     const weeklyBookingsData = {
//         labels: dayLabels, // Use the proper day labels
//         datasets: [
//             {
//                 label: 'Bookings',
//                 data: weeklyCounts, // Use the processed counts
//                 borderColor: 'rgb(59, 130, 246)',
//                 backgroundColor: 'rgba(59, 130, 246, 0.1)',
//                 tension: 0.4,
//                 fill: true,
//             },
//         ],
//     };



//     //update funciton
//     const handleUpdateSettings = async (updatedData) => {
//         try {
//             const result = await axios({
//                 method: 'put',
//                 url: 'http://localhost:5000/api/admin/settings/platform-fee',
//                 data: updatedData,
//                 withCredentials: true
//             });
//             setSettings(result.data); // Update state with the new settings from the backend
//             setIsSettingsModalOpen(false);
//             // You can add a success toast notification here
//         } catch (error) {
//             console.error('Failed to update settings:', error);
//             // You can add an error toast notification here
//         }
//     };


//     // Monthly signups chart data

    
//     const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const monthlyCounts = new Array(12).fill(0);
    
//     data.monthlySignups.forEach(signupData => {
//     // The month from the API (_id) is 1-based (e.g., 10 for October).
//     // Array indices are 0-based, so we subtract 1.
//     const monthIndex = signupData._id - 1;

//     // Check if the month index is valid (0-11) before assigning.
//     if (monthIndex >= 0 && monthIndex < 12) {
//         monthlyCounts[monthIndex] = signupData.count;
//     }
// });
//     const monthlySignupsData = {
//         labels: monthLabels,
//         datasets: [
//             {
//                 label: 'New Students',
//                 data:monthlyCounts,
//                 backgroundColor: 'rgba(16, 185, 129, 0.8)',
//                 borderColor: 'rgb(16, 185, 129)',
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => (
//         <div className="admin-stats-card">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-sm font-medium text-admin-600">{title}</p>
//                     <p className="text-2xl font-bold text-admin-900">{value.toLocaleString()}</p>
//                     {trend && (
//                         <div className="flex items-center mt-2">
//                             {trend === 'up' ? (
//                                 <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
//                             ) : (
//                                 <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
//                             )}
//                             <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
//                                 {trendValue}%
//                             </span>
//                         </div>
//                     )}
//                 </div>
//                 <div className={`p-3 rounded-full bg-${color}-100`}>
//                     <Icon className={`h-6 w-6 text-${color}-600`} />
//                 </div>
//             </div>
//         </div>
//     );

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="admin-loading"></div>
//             </div>
//         );
//     }


//     //setting model component
//     const SettingsModal = ({ isOpen, onClose, currentSettings, onSave }) => {
//     const [fee, setFee] = useState(0);
//     const [payoutDate, setPayoutDate] = useState('');

//     useEffect(() => {
//         if (currentSettings) {
//             setFee(currentSettings.platformFeePercentage);
            
//             // This is the fix: Check if payoutDate exists before trying to format it
//             if (currentSettings.payoutDate) {
//                 setPayoutDate(new Date(currentSettings.payoutDate).toISOString().split('T')[0]);
//             } else {
//                 setPayoutDate(''); // Set to empty string if it's null
//             }
//         }
//     }, [currentSettings]);

//     if (!isOpen) return null;

//     const handleSave = () => {
//         onSave({ platformFeePercentage: fee, payoutDate });
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//                 <h3 className="text-lg font-bold text-admin-900 mb-4">Platform Settings</h3>
//                 <div className="space-y-4">
//                     <div>
//                         <label htmlFor="platformFee" className="block text-sm font-medium text-admin-700">Platform Fee Percentage (%)</label>
//                         <input
//                             type="number"
//                             id="platformFee"
//                             value={fee}
//                             onChange={(e) => setFee(e.target.value)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="payoutDate" className="block text-sm font-medium text-admin-700">Next Payout Date</label>
//                         <input
//                             type="date"
//                             id="payoutDate"
//                             value={payoutDate}
//                             onChange={(e) => setPayoutDate(e.target.value)}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                         />
//                     </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                     <button onClick={onClose} className="admin-button-secondary">Cancel</button>
//                     <button onClick={handleSave} className="admin-button-primary">Save Changes</button>
//                 </div>
//             </div>
//         </div>
//     );
// };



//     return (
//         <div className="space-y-6">
//             {/* Page Header */}
//             <div>
//                 <h1 className="text-2xl font-bold text-admin-900">Dashboard Overview</h1>
//                 <p className="text-admin-600">Monitor your platform's performance and key metrics</p>
//             </div>

//             {/* Statistics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <StatCard
//                     title="Total Students"
//                     value={stats.totalStudents}
//                     icon={UsersIcon}
//                     trend="up"
//                     trendValue="12.5"
//                     color="blue"
//                 />
//                 <StatCard
//                     title="Registered Faculty"
//                     value={stats.registeredFaculty}
//                     icon={AcademicCapIcon}
//                     trend="up"
//                     trendValue="8.2"
//                     color="green"
//                 />
//                 <StatCard
//                     title="Total Bookings"
//                     value={stats.totalBookings}
//                     icon={CalendarDaysIcon}
//                     trend="up"
//                     trendValue="15.3"
//                     color="purple"
//                 />
//                 <StatCard
//                     title="Revenue (USD)"
//                     value={`$${stats.revenue.toLocaleString()}`}
//                     icon={CurrencyDollarIcon}
//                     trend="up"
//                     trendValue="22.1"
//                     color="yellow"
//                 />
//             </div>

//             {/* Charts Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Weekly Bookings Chart */}
//                 <div className="admin-chart-container">
//                     <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-admin-900">Weekly Bookings</h3>
//                         <div className="flex items-center space-x-2">
//                             <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
//                             <span className="text-sm text-admin-600">This Week</span>
//                         </div>
//                     </div>
//                     <div className="h-64">
//                         <Line data={weeklyBookingsData} options={chartOptions} />
//                     </div>
//                 </div>

//                 {/* Monthly Signups Chart */}
//                 <div className="admin-chart-container">
//                     <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-admin-900">Monthly Signups</h3>
//                         <div className="flex items-center space-x-2">
//                             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                             <span className="text-sm text-admin-600">Last 6 Months</span>
//                         </div>
//                     </div>
//                     <div className="h-64">
//                         <Bar data={monthlySignupsData} options={chartOptions} />
//                     </div>
//                 </div>
//             </div>

//             {/* Platform Fee Tracking */}
//             <div className="admin-chart-container">
//                 <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-admin-900">Platform Fee Tracking</h3>
                   
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-primary-50 p-4 rounded-lg">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-primary-600">USD Revenue</p>
//                                 <p className="text-xl font-bold text-primary-900">
//                                     ${revenueByCurrency.USD.toLocaleString()}
//                                 </p>
//                             </div>
//                             <CurrencyDollarIcon className="h-8 w-8 text-primary-400" />
//                         </div>
//                     </div>

//                     <div className="bg-green-50 p-4 rounded-lg">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                <p className="text-sm text-green-600">INR Revenue</p>
//                                 <p className="text-xl font-bold text-green-900">
//                                     ₹{revenueByCurrency.INR.toLocaleString()}
//                                 </p>
//                             </div>
//                             <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
//                         </div>
//                     </div>

//                     <button onClick={() => setIsSettingsModalOpen(true)} className="bg-yellow-50 p-4 rounded-lg text-left hover:shadow-md transition-shadow">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-yellow-600">Platform Fee Rate</p>
//                                 <p className="text-xl font-bold text-yellow-900">{settings?.platformFeePercentage}%</p>
//                             </div>
//                             <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-400" />
//                         </div>
//                     </button>
//                 </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="admin-card">
//                 <h3 className="text-lg font-semibold text-admin-900 mb-4">Quick Actions</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <button className="admin-button-primary p-4 text-left">
//                         <div className="flex items-center space-x-3">
//                             <UsersIcon className="h-6 w-6" />
//                             <div>
//                                 <p className="font-medium">Manage Faculty</p>
//                                 <p className="text-sm opacity-90">View and manage faculty members</p>
//                             </div>
                            
//                         </div>
//                     </button>

//                     <button onClick={() => setIsSettingsModalOpen(true)} className="admin-button-secondary p-4 text-left">
//                         <div className="flex items-center space-x-3">
//                             <CalendarDaysIcon className="h-6 w-6" />
//                             <div>
//                                 <p className="font-medium">Set Next Payout Date</p>
//                                 <p className="text-sm opacity-90">
//                                     Current: {settings && settings.payoutDate ? new Date(settings.payoutDate).toLocaleDateString() : 'Not Set'}
//                                 </p>
//                             </div>
//                         </div>
//                     </button>

//                     <button className="admin-button-secondary p-4 text-left">
//                         <div className="flex items-center space-x-3">
//                             <CalendarDaysIcon className="h-6 w-6" />
//                             <div>
//                                 <p className="font-medium">View Analytics</p>
//                                 <p className="text-sm opacity-90">Detailed platform analytics</p>
//                             </div>
//                         </div>
//                     </button>
//                 </div>
//             </div>
//             <SettingsModal
//                 isOpen={isSettingsModalOpen}
//                 onClose={() => setIsSettingsModalOpen(false)}
//                 currentSettings={settings}
//                 onSave={handleUpdateSettings}
//             />
//         </div>
//     );
// };

// export default MainContentA;