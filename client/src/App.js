import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SupportPage from './pages/SupportPage';
import ProfessorAuthPage from './pages/ProfessorAuthPage';
import ProfessorDetailPage from './pages/ProfessorDetailPage';
import StudentAuthPage from './pages/StudentAuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import PricingPage from './pages/PricingPage';
import TermsAndConditionsPage from './pages/TermsAndConditionPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { ToastProvider } from './contexts/ToastContext';

import './index.css'; 

function App() {
  return (
    <ToastProvider>
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />      
        <Route path="/support" element={<SupportPage />} />  
        <Route path="/contact" element={<SupportPage />} />     
        <Route path="/browse" element={<BrowsePage />} />      
        <Route path="/faculty/login" element={<ProfessorAuthPage />} />      
        <Route path="/faculty/signup" element={<ProfessorAuthPage />} />      
        <Route path="/student/login" element={<StudentAuthPage />} />   
        <Route path="/student/signup" element={<StudentAuthPage />} />   
        <Route path="/professor/:id" element={<ProfessorDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route 
            path="/faculty-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

      </Routes>
    </div>
    </Router>
    </ToastProvider>
  );
}

export default App;