import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ currentUser, onLogin, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  const navigateToAdmin = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-semibold text-gray-800">
              Connecta ISP
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {currentUser ? (
                <>
                  <span className="text-sm font-medium text-gray-500">
                    {currentUser.name}
                  </span>
                  {currentUser.role === 'admin' && (
                    <>
                      <span className="mx-2">&middot;</span>
                      <a 
                        href="/admin"
                        onClick={navigateToAdmin}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
                      >
                        Admin Dashboard
                      </a>
                    </>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a 
                    href="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Login
                  </a>
                  <a 
                    href="/register"
                    className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;