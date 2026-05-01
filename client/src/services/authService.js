import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const register = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
    headers: { Authorization: `Bearer ${refreshToken}` }
  });
  return response.data;
};