import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { redeemVoucher } from '../services/voucherService';

const Profile = ({ currentUser, onLogout }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');
    
    try {
      const response = await redeemVoucher(voucherCode);
      setMessage(response.message || 'Voucher redeemed successfully!');
      setMessageType('success');
      // Optionally refresh user data or redirect
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to redeem voucher');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Voucher Redemption Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Redeem Voucher</h2>
          {message && (
            <div className={`p-4 rounded mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleVoucherSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Voucher Code</label>
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Enter your voucher code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Redeeming...' : 'Redeem Voucher'}
            </button>
          </form>
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