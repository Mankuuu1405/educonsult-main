import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    
    // Check for faculty or student info in local storage
    const facultyInfo = JSON.parse(localStorage.getItem('facultyInfo'));
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo')); // Assuming you'll create this for students
    
    const userInfo = facultyInfo || studentInfo; // Get the logged-in user

    if (!userInfo) {
        // If user is not logged in, redirect them to the login page
        return <Navigate to="/faculty/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
        // If user's role is not allowed, redirect them to a 'not authorized' page or home
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children; // If authenticated and authorized, render the component
};

export default ProtectedRoute;