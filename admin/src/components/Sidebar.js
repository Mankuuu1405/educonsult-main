import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { 
  HomeIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const { isOpen, closeSidebar, toggleSidebar } = useSidebar();

  const navigation = [
    { name: 'Overview', href: '/', icon: HomeIcon },
    { name: 'Faculty Management', href: '/faculty', icon: UsersIcon },
    { name: 'Withdrawal Requests', href: '/withdrawals', icon: CurrencyDollarIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Floating toggle button - always visible */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-colors lg:hidden"
        title="Toggle Sidebar"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>
      
      <div className={`admin-sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-admin-700">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-8 w-8 text-primary-400" />
            <span className="text-xl font-bold text-white">EduConsult</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-1 rounded-md text-admin-400 hover:text-white hover:bg-admin-700 transition-colors"
              title="Toggle Sidebar"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md text-admin-400 hover:text-white hover:bg-admin-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      
        <nav className="mt-8">
          <div className="px-6 mb-6">
            <h3 className="text-xs font-semibold text-admin-400 uppercase tracking-wider">
              Admin Panel
            </h3>
          </div>
          
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-admin-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <CogIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-admin-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
