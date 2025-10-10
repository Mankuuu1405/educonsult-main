import React, { useState } from 'react';
// --- 1. VERIFY THESE IMPORTS ---
// They should be exactly like this, without curly braces.
import SidebarA from '../components/AdminDashboard/SidebarA';
import MainContentA from '../components/AdminDashboard/MainContentA';
import FacultyManagement from '../components/AdminDashboard/FacultyManagement';
import WithdrawalRequests from '../components/AdminDashboard/WithdrawalRequests';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <MainContentA />;
      case 'faculty':
        return <FacultyManagement />;
      case 'withdrawals':
        return <WithdrawalRequests />
      default:
        return <MainContentA />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="flex h-screen">

        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <SidebarA activeView={activeView} onNavigate={setActiveView} />
        </div>

        <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="w-64 h-full bg-slate-800">
            <SidebarA
              activeView={activeView}
              onNavigate={(view) => {
                setActiveView(view);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-700">Admin Panel</h2>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-100">
              {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"></div>
      )}
    </div>
  );
};

// --- 2. ALSO VERIFY THE EXPORT HERE ---
export default AdminDashboard;