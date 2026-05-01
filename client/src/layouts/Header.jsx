import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Connecta ISP</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Home</a>
              <a href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">About</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;