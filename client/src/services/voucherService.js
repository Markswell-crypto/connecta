import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const redeemVoucher = async (voucherCode) => {
  const response = await axios.post(`${API_BASE_URL}/vouchers/redeem`, {
    code: voucherCode
  });
  return response.data;
};

// Note: Voucher generation is admin-only and would typically be done in an admin dashboard
// For completeness, here's the service function but it would require admin auth
export const generateVouchers = async (count, value, expiresAt) => {
  const response = await axios.post(`${API_BASE_URL}/vouchers/generate`, {
    count,
    value,
    expires_at: expiresAt
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  });
  return response.data;
};