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
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

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

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalStudents: 1247,
          registeredFaculty: 89,
          totalBookings: 3456,
          revenue: 125430,
          platformFees: 12543
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Weekly bookings chart data
  const weeklyBookingsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings',
        data: [45, 52, 38, 67, 89, 34, 56],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Monthly signups chart data
  const monthlySignupsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Students',
        data: [120, 150, 180, 200, 165, 190],
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
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-admin-600">Total Platform Fees</p>
              <p className="text-2xl font-bold text-primary-600">${stats.platformFees.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-admin-600">This Month</p>
              <p className="text-lg font-semibold text-green-600">+$2,450</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">USD Revenue</p>
                <p className="text-xl font-bold text-primary-900">$98,450</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-primary-400" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">INR Revenue</p>
                <p className="text-xl font-bold text-green-900">₹2,15,000</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Platform Fee Rate</p>
                <p className="text-xl font-bold text-yellow-900">10%</p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
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
          
          <button className="admin-button-secondary p-4 text-left">
            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="h-6 w-6" />
              <div>
                <p className="font-medium">Process Withdrawals</p>
                <p className="text-sm opacity-90">Review pending withdrawal requests</p>
              </div>
            </div>
          </button>
          
          <button className="admin-button-secondary p-4 text-left">
            <div className="flex items-center space-x-3">
              <CalendarDaysIcon className="h-6 w-6" />
              <div>
                <p className="font-medium">View Analytics</p>
                <p className="text-sm opacity-90">Detailed platform analytics</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContentA;
