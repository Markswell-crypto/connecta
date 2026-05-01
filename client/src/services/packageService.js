import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getAllPackages = async () => {
  const response = await axios.get(`${API_BASE_URL}/packages`);
  return response.data;
};

export const createPackage = async (packageData) => {
  const response = await axios.post(`${API_BASE_URL}/packages`, packageData);
  return response.data;
};

export const updatePackage = async (packageId, packageData) => {
  const response = await axios.put(`${API_BASE_URL}/packages/${packageId}`, packageData);
  return response.data;
};

export const deletePackage = async (packageId) => {
  const response = await axios.delete(`${API_BASE_URL}/packages/${packageId}`);
  return response.data;
};