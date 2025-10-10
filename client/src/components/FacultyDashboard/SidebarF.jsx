import React from 'react';
import { Link } from 'react-router-dom';

// Import all necessary icons from the lucide-react library
import { 
    LayoutDashboard, 
    MessageSquare, 
    UserCog, 
    LogOut, 
    SparklesIcon, 
    CalendarCheck 
} from 'lucide-react';

const SidebarF = ({ activeView, onNavigate , profileData  }) => {

    // Array of navigation links. 'view' corresponds to the state in FacultyDashboard.
    const navLinks = [
        { view: 'dashboard', icon: LayoutDashboard, text: 'My Earnings' },
        { view: 'bookings', icon: CalendarCheck, text: 'View Bookings' },
        { view: 'services', icon: SparklesIcon, text: 'Manage Services' },
        { view: 'live-chat', icon: MessageSquare, text: 'My Chats'},
        { view: 'profile', icon: UserCog, text: 'Edit Profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('facultyInfo');
        // This will force a reload and redirect to the login page via your ProtectedRoute logic
        window.location.href = '/'; 
    };

    return (
        <div className="flex flex-col h-full bg-slate-800 text-slate-200">
            
            {/* Header / Logo Section */}
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white text-center">Faculty Panel</h2>
            </div>
            
           <div className="p-4 text-center border-b border-slate-700">
                <img 
                    className="h-20 w-20 rounded-full border-2 border-indigo-400 object-cover mx-auto shadow-lg" 
                    // Use dynamic data with a fallback for loading state
                    src={profileData?.profileImage || '/default-avatar.png'} 
                    alt="Faculty Profile" 
                />
                <h3 className="mt-3 font-semibold text-white">
                    {/* Show name or a loading placeholder */}
                    {profileData?.fullName || 'Loading...'}
                </h3>
                <p className="text-xs text-slate-400">
                    {/* Show title or a default value */}
                    {profileData?.title || 'Faculty Member'}
                </p>
            </div>
            
            {/* Navigation Links Section */}
            <nav className="flex-grow p-4">
                <ul className="space-y-1">
                    {navLinks.map((link) => (
                        <li key={link.text}>
                            {/* Each navigation item is a button that calls the onNavigate function */}
                            <button 
                                onClick={() => onNavigate(link.view)} 
                                className={`w-full flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 text-left ${
                                    activeView === link.view
                                    ? 'bg-indigo-600 text-white shadow-inner' 
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                <link.icon className="h-5 w-5 mr-3" />
                                <span className="font-medium">{link.text}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            
           <div className="p-4 border-t border-slate-700">
                {/* Changed from a Link to a button with an onClick handler for proper logout */}
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default SidebarF;