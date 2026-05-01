import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is admin (redirect if not)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== 'admin') {
      navigate('/profile');
      return;
    }
    
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="animate-spin rounded-full border-4 border-t-blue-500 w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 sm:px-8">
        <div className="py-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112-0v1zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.total_users || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 011.946 2.13c-.103.74-.37 1.373-.775 1.874-1.156 1.818-2.345 2.95-3.698 3.09C7.27 14.413 5.78 14.14 4.75 13.062a4.886 4.886 0 01-1.964-2.459c-.47-1.131-.22-2.39.73-3.16z"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.active_users || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.active_sessions || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .6-3 1.3V15l-3-3-.28-.283a1.003 1.003 0 10-1.415 1.415L8 14l-2 2 1.5 1.5a1.003 1.003 0 001.415-1.415L12 13l3.78-3.78a1.003 1.003 0 00-1.415-1.415L12 11z"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">${stats?.revenue?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="space-y-6">
            {/* Recent Payments Table */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Payments</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats?.recent_payments?.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{payment.user_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payment.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.transaction_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {stats?.recent_payments?.length === 0 && (
                      <tr>
                        <td className="px-6 py-4 text-center text-gray-500" colSpan="6">
                          No recent payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Sessions Table */}
            <div>
              <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Used (MB)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats?.active_sessions_detail?.map(session => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{session.user_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(session.start_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.data_used}</td>
                      </tr>
                    ))}
                    {stats?.active_sessions_detail?.length === 0 && (
                      <tr>
                        <td className="px-6 py-4 text-center text-gray-500" colSpan="4">
                          No active sessions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users Table */}
            <div>
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats?.users_list?.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {stats?.users_list?.length === 0 && (
                      <tr>
                        <td className="px-6 py-4 text-center text-gray-500" colSpan="6">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;