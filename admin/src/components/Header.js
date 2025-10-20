import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="admin-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-admin-600 hover:bg-admin-100 border border-admin-300 hover:border-admin-400 transition-colors"
            title="Toggle Sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-admin-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="admin-input pl-10 w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg text-admin-600 hover:bg-admin-100 relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-admin-100"
            >
              <UserCircleIcon className="h-8 w-8 text-admin-600" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-admin-900">Admin User</p>
                <p className="text-xs text-admin-500">Administrator</p>
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-admin-200 py-1 z-50">
                <button className="block w-full text-left px-4 py-2 text-sm text-admin-700 hover:bg-admin-100">
                  Profile Settings
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-admin-700 hover:bg-admin-100">
                  Account Settings
                </button>
                <hr className="my-1" />
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
