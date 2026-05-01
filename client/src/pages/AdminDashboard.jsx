import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../services/packageService';

const AdminDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    time_limit: '',
    data_limit: '',
    speed_limit: ''
  });
  const navigate = useNavigate();

  // Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await getAllPackages();
        setPackages(response.packages || response); // Adjust based on actual response structure
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch packages');
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPackage) {
        // Update
        await updatePackage(selectedPackage.id, formData);
        setShowEditModal(false);
      } else {
        // Create
        await createPackage(formData);
        setShowCreateModal(false);
      }
      // Reset form and refetch
      setFormData({
        name: '',
        price: '',
        time_limit: '',
        data_limit: '',
        speed_limit: ''
      });
      await fetchPackages(); // Refetch packages
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  // Handle delete
  const handleDelete = async (packageId) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }
    try {
      await deletePackage(packageId);
      await fetchPackages(); // Refetch after deletion
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete package');
    }
  };

  // Handle edit
  const handleEdit = (package) => {
    setSelectedPackage(package);
    setFormData({
      name: package.name,
      price: package.price.toString(),
      time_limit: package.time_limit ? package.time_limit.toString() : '',
      data_limit: package.data_limit ? package.data_limit.toString() : '',
      speed_limit: package.speed_limit ? package.speed_limit.toString() : ''
    });
    setShowEditModal(true);
  };

  // Reset form when closing modals
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      time_limit: '',
      data_limit: '',
      speed_limit: ''
    });
    setSelectedPackage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full border-4 border-t-blue-500 w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Package
          </button>
        </header>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

        {/* Packages Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Limit (min)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Limit (MB)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speed Limit (Mbps)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${pkg.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.time_limit || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.data_limit || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.speed_limit || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan="6">
                    No packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Package Modal */}
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            ${showCreateModal ? 'block' : 'hidden'}
            bg-gray-800 bg-opacity-50
          `}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Package</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
                <input
                  type="number"
                  name="time_limit"
                  value={formData.time_limit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Limit (MB)</label>
                <input
                  type="number"
                  name="data_limit"
                  value={formData.data_limit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Speed Limit (Mbps)</label>
                <input
                  type="number"
                  name="speed_limit"
                  value={formData.speed_limit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Edit Package Modal */}
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            ${showEditModal ? 'block' : 'hidden'}
            bg-gray-800 bg-opacity-50
          `}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Package</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
                <input
                  type="number"
                  name="time_limit"
                  value={formData.time_limit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Limit (MB)</label>
                <input
                  type="number"
                  name="data_limit"
                  value={formData.data_limit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Speed Limit (Mbps)</label>
                <input
                  type="number"
                  name="speed_limit"
                  value={formData.speed_limit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Package
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;