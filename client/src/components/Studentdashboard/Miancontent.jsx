import React from 'react';
// Import the three service components
import Booking from '../Studentdashboard/Booking';

const MainContent = () => {
  return (
    <div className="flex-1 p-8 bg-white h-screen overflow-y-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Student Dashboard</h1>
      </header>

      {/* Integrated Components Container */}
      <div className="flex flex-wrap justify-start items-start gap-8">
        {/* Render your three components here */}
        <Booking />
       
      </div>
    </div>
  );
};

export default MainContent;