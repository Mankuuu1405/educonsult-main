import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import MainContentA from './components/MainContentA';
import FacultyManagement from './components/FacultyManagement';
import WithdrawalRequests from './components/WithdrawalRequests';
import './index.css';

const AppContent = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const { isOpen } = useSidebar();

  if (loading) {
    return (
      <div className="min-h-screen bg-admin-50 flex items-center justify-center">
        <div className="admin-loading"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="flex h-screen bg-admin-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-admin-50">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<MainContentA />} />
              <Route path="/faculty" element={<FacultyManagement />} />
              <Route path="/withdrawals" element={<WithdrawalRequests />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <AppContent />
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
