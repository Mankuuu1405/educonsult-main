import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const WithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockWithdrawals = [
          {
            id: 1,
            facultyId: 1,
            facultyName: 'Dr. Sarah Johnson',
            facultyEmail: 'sarah.johnson@email.com',
            amount: 2500,
            currency: 'USD',
            requestedDate: '2024-01-15',
            status: 'pending',
            paymentMethod: 'Bank Transfer',
            accountDetails: {
              bankName: 'Chase Bank',
              accountNumber: '****1234',
              routingNumber: '021000021'
            },
            totalEarnings: 12500,
            previousWithdrawals: 10000
          },
          {
            id: 2,
            facultyId: 2,
            facultyName: 'Prof. Michael Chen',
            facultyEmail: 'michael.chen@email.com',
            amount: 3200,
            currency: 'USD',
            requestedDate: '2024-01-14',
            status: 'approved',
            paymentMethod: 'PayPal',
            accountDetails: {
              email: 'michael.chen@email.com'
            },
            totalEarnings: 18900,
            previousWithdrawals: 15700,
            approvedDate: '2024-01-15',
            approvedBy: 'Admin User'
          },
          {
            id: 3,
            facultyId: 3,
            facultyName: 'Dr. Emily Rodriguez',
            facultyEmail: 'emily.rodriguez@email.com',
            amount: 1500,
            currency: 'USD',
            requestedDate: '2024-01-13',
            status: 'rejected',
            paymentMethod: 'Bank Transfer',
            accountDetails: {
              bankName: 'Wells Fargo',
              accountNumber: '****5678',
              routingNumber: '121000248'
            },
            totalEarnings: 8200,
            previousWithdrawals: 6700,
            rejectedDate: '2024-01-14',
            rejectedBy: 'Admin User',
            rejectionReason: 'Insufficient documentation provided'
          },
          {
            id: 4,
            facultyId: 4,
            facultyName: 'Prof. David Kim',
            facultyEmail: 'david.kim@email.com',
            amount: 1800,
            currency: 'USD',
            requestedDate: '2024-01-12',
            status: 'pending',
            paymentMethod: 'Stripe',
            accountDetails: {
              stripeAccountId: 'acct_1234567890'
            },
            totalEarnings: 11200,
            previousWithdrawals: 9400
          }
        ];
        
        setWithdrawals(mockWithdrawals);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching withdrawals:', error);
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.facultyEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || withdrawal.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewWithdrawal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowModal(true);
  };

  const handleApprove = async (withdrawalId) => {
    try {
      // API call to approve withdrawal
      console.log('Approving withdrawal:', withdrawalId);
      // Update local state
      setWithdrawals(prev => prev.map(w => 
        w.id === withdrawalId 
          ? { ...w, status: 'approved', approvedDate: new Date().toISOString(), approvedBy: 'Admin User' }
          : w
      ));
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    }
  };

  const handleReject = async (withdrawalId) => {
    try {
      // API call to reject withdrawal
      console.log('Rejecting withdrawal:', withdrawalId);
      // Update local state
      setWithdrawals(prev => prev.map(w => 
        w.id === withdrawalId 
          ? { ...w, status: 'rejected', rejectedDate: new Date().toISOString(), rejectedBy: 'Admin User' }
          : w
      ));
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "admin-badge";
    switch (status) {
      case 'pending':
        return `${baseClasses} admin-badge-warning`;
      case 'approved':
        return `${baseClasses} admin-badge-success`;
      case 'rejected':
        return `${baseClasses} admin-badge-danger`;
      default:
        return `${baseClasses} admin-badge-info`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckIcon className="h-4 w-4" />;
      case 'rejected':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-900">Withdrawal Requests</h1>
          <p className="text-admin-600">Manage faculty withdrawal requests and payments</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-admin-600">Pending Requests</p>
            <p className="text-2xl font-bold text-yellow-600">
              {withdrawals.filter(w => w.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="admin-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-admin-400" />
            </div>
            <input
              type="text"
              placeholder="Search withdrawals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="admin-button-secondary">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Amount</th>
                <th>Request Date</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-admin-900">{withdrawal.facultyName}</p>
                        <p className="text-sm text-admin-600">{withdrawal.facultyEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(withdrawal.amount, withdrawal.currency)}
                    </p>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="h-4 w-4 text-admin-400" />
                      <span>{new Date(withdrawal.requestedDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className="px-2 py-1 bg-admin-100 text-admin-700 text-xs rounded-full">
                      {withdrawal.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`${getStatusBadge(withdrawal.status)} flex items-center space-x-1`}>
                      {getStatusIcon(withdrawal.status)}
                      <span className="capitalize">{withdrawal.status}</span>
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewWithdrawal(withdrawal)}
                        className="p-2 text-admin-600 hover:bg-admin-100 rounded-lg"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {withdrawal.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(withdrawal.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(withdrawal.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Reject"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Detail Modal */}
      {showModal && selectedWithdrawal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-admin-900">
                  Withdrawal Request Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-admin-400 hover:text-admin-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Faculty Information */}
                <div className="bg-admin-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-admin-900 mb-3">Faculty Information</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-admin-900">{selectedWithdrawal.facultyName}</p>
                      <p className="text-sm text-admin-600">{selectedWithdrawal.facultyEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Withdrawal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-admin-600">Requested Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(selectedWithdrawal.amount, selectedWithdrawal.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-600">Payment Method</p>
                    <p className="font-semibold">{selectedWithdrawal.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-600">Request Date</p>
                    <p className="font-semibold">
                      {new Date(selectedWithdrawal.requestedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-600">Status</p>
                    <span className={getStatusBadge(selectedWithdrawal.status)}>
                      {selectedWithdrawal.status}
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h4 className="font-semibold text-admin-900 mb-3">Account Details</h4>
                  <div className="bg-admin-50 p-4 rounded-lg">
                    {Object.entries(selectedWithdrawal.accountDetails).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-admin-200 last:border-b-0">
                        <span className="text-sm text-admin-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earnings Summary */}
                <div>
                  <h4 className="font-semibold text-admin-900 mb-3">Earnings Summary</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Total Earnings</p>
                      <p className="text-lg font-bold text-green-800">
                        {formatCurrency(selectedWithdrawal.totalEarnings, selectedWithdrawal.currency)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Previous Withdrawals</p>
                      <p className="text-lg font-bold text-blue-800">
                        {formatCurrency(selectedWithdrawal.previousWithdrawals, selectedWithdrawal.currency)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Available Balance</p>
                      <p className="text-lg font-bold text-purple-800">
                        {formatCurrency(
                          selectedWithdrawal.totalEarnings - selectedWithdrawal.previousWithdrawals,
                          selectedWithdrawal.currency
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {(selectedWithdrawal.approvedDate || selectedWithdrawal.rejectedDate) && (
                  <div>
                    <h4 className="font-semibold text-admin-900 mb-3">Status History</h4>
                    <div className="bg-admin-50 p-4 rounded-lg">
                      {selectedWithdrawal.approvedDate && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckIcon className="h-4 w-4" />
                          <span className="text-sm">
                            Approved by {selectedWithdrawal.approvedBy} on{' '}
                            {new Date(selectedWithdrawal.approvedDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedWithdrawal.rejectedDate && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <XMarkIcon className="h-4 w-4" />
                          <span className="text-sm">
                            Rejected by {selectedWithdrawal.rejectedBy} on{' '}
                            {new Date(selectedWithdrawal.rejectedDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedWithdrawal.rejectionReason && (
                        <p className="text-sm text-red-600 mt-2">
                          Reason: {selectedWithdrawal.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-admin-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="admin-button-secondary"
                >
                  Close
                </button>
                {selectedWithdrawal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleReject(selectedWithdrawal.id);
                        setShowModal(false);
                      }}
                      className="admin-button-danger"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedWithdrawal.id);
                        setShowModal(false);
                      }}
                      className="admin-button-primary"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequests;
