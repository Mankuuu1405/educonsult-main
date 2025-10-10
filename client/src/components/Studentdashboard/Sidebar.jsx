import React from 'react';
import { Link } from 'react-router-dom';
import { BookCopy, Users, CircleUserRound, LogOut } from 'lucide-react';

// --- Accept profileData as a prop ---
const Sidebar = ({ activeView, onNavigate, profileData }) => {

  const navLinks = [
    { view: "booking", icon: BookCopy, text: "My Bookings" },
    { view: "chat", icon: BookCopy, text: "My Chats" },
    { view: "browse", icon: Users, text: "Find Tutors", path: "/browse" },
    { view: "profile", icon: CircleUserRound, text: "My Profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('studentInfo');
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 text-slate-200 w-64 flex-shrink-0">
      <div className="p-4 border-b border-slate-700">
        <Link to="/" className="text-2xl font-bold text-white text-center block">LMS Portal</Link>
      </div>

      {/* --- MODIFIED Profile Section --- */}
      <div className="p-4 text-center border-b border-slate-700 relative">
        <img
          className="h-20 w-20 rounded-full border-2 border-indigo-400 object-cover mx-auto shadow-lg"
          // Use dynamic data with fallbacks
          src={profileData?.profileImage}
          alt="Student Profile"
        />
        <h3 className="mt-3 font-semibold text-white">
          {profileData?.fullName || 'Student'}
        </h3>
      </div>

      <nav className="flex-grow p-4">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.text}>
              {link.path ? (
                <Link
                  to={link.path}
                  onClick={() => onNavigate(link.view)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeView === link.view ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{link.text}</span>
                </Link>
              ) : (
                <button
                  onClick={() => onNavigate(link.view)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${activeView === link.view ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{link.text}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white">
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;