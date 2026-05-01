import React from 'react';

const Profile = ({ currentUser, onLogout }) => {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          User Profile
        </h1>
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-2"><strong>Name:</strong> {currentUser.name}</p>
          <p className="mb-2"><strong>Email:</strong> {currentUser.email}</p>
          <p className="mb-2"><strong>Role:</strong> {currentUser.role}</p>
          <p className="mb-2"><strong>ID:</strong> {currentUser.id}</p>
        </div>
        <div className="mt-6">
          <button
            onClick={onLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;