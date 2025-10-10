import React, { useState } from 'react';
// Import icons for a polished UI
import { Landmark, Check, X, User, Banknote } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

// --- Mock Data ---
// In a real app, this data would be fetched from your backend API
const mockRequests = [
    {
        id: 'wr_001',
        faculty: {
            name: 'Dr. Evelyn Reed',
            email: 'e.reed@univ.edu',
            expertise: ['Physics', 'Astrophysics'],
            profileImage: 'https://i.pravatar.cc/150?u=faculty1',
        },
        amount: 450.75,
        date: '2025-08-16T10:00:00Z',
        paymentMethod: {
            type: 'bank',
            accountHolder: 'Evelyn Reed',
            accountNo: '..._..._1234',
            ifsc: 'BKID0001234',
        }
    },
    {
        id: 'wr_002',
        faculty: {
            name: 'Mr. Samuel Chen',
            email: 's.chen@univ.edu',
            expertise: ['Computer Science', 'AI'],
            profileImage: 'https://i.pravatar.cc/150?u=faculty2',
        },
        amount: 820.00,
        date: '2025-08-15T18:30:00Z',
        paymentMethod: {
            type: 'upi',
            upiId: 'samuel.chen@okbank',
            name: 'Samuel T. Chen',
        }
    }
];

// --- Main Component ---
const WithdrawalRequests = () => {
    // State to manage the list of requests
    const [requests, setRequests] = useState(mockRequests);
      const { addToast } = useToast();

    // Function to handle approving or rejecting a request
    const handleProcessRequest = (requestId, status) => {
        // In a real app, you would send this update to your API
        // alert(`Request ${requestId} has been ${status}.`);
        addToast(`Request ${requestId} has been ${status}.`, status === 'approved' ? 'success' : 'error');
        // For this demo, we'll just remove the request from the list
        setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Withdrawal Requests</h1>
                <p className="text-slate-500 mt-1">Review and process pending withdrawal requests from faculty.</p>
            </header>

            {requests.length > 0 ? (
                <div className="space-y-6">
                    {requests.map(request => (
                        <div key={request.id} className="bg-white p-6 rounded-xl shadow-md">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* Column 1: Faculty Details */}
                                <div className="lg:border-r lg:pr-6 border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <img src={request.faculty.profileImage} alt={request.faculty.name} className="w-16 h-16 rounded-full mr-4" />
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{request.faculty.name}</h3>
                                            <p className="text-sm text-slate-500">{request.faculty.email}</p>
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Expertise:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {request.faculty.expertise.map(tag => (
                                            <span key={tag} className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Column 2: Withdrawal Details */}
                                <div className="lg:border-r lg:pr-6 border-slate-200">
                                    <h4 className="font-semibold text-slate-600 mb-2">Withdrawal Amount</h4>
                                    <p className="text-4xl font-bold text-emerald-600">${request.amount.toFixed(2)}</p>
                                    <p className="text-xs text-slate-400 mt-1">Requested on: {new Date(request.date).toLocaleDateString()}</p>
                                    
                                    <h4 className="font-semibold text-slate-600 mt-4 mb-2">Payment To:</h4>
                                    <div className="bg-slate-50 p-3 rounded-lg text-sm">
                                        {request.paymentMethod.type === 'bank' ? (
                                            <>
                                                <p className="flex items-center"><User className="w-4 h-4 mr-2 text-slate-400"/> {request.paymentMethod.accountHolder}</p>
                                                <p className="flex items-center font-mono"><Banknote className="w-4 h-4 mr-2 text-slate-400"/> {request.paymentMethod.accountNo}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="flex items-center"><User className="w-4 h-4 mr-2 text-slate-400"/> {request.paymentMethod.name}</p>
                                                <p className="font-mono">{request.paymentMethod.upiId}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Column 3: Actions */}
                                <div className="flex flex-col justify-center space-y-3">
                                    <button 
                                        onClick={() => handleProcessRequest(request.id, 'approved')}
                                        className="w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <Check className="w-5 h-5 mr-2" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleProcessRequest(request.id, 'rejected')}
                                        className="w-full flex items-center justify-center bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-5 h-5 mr-2" /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-xl shadow-md text-center">
                    <Landmark className="w-12 h-12 mx-auto text-slate-300" />
                    <h3 className="mt-4 text-xl font-bold text-slate-700">All Clear!</h3>
                    <p className="mt-1 text-slate-500">There are no pending withdrawal requests.</p>
                </div>
            )}
        </div>
    );
};

export default WithdrawalRequests;