import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies
});

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me')
};

// Accounts APIs
export const accountsAPI = {
  getAccounts: () => api.get('/accounts'),
  createAccount: (data) => api.post('/accounts', data),
  updateAccount: (id, data) => api.put(`/accounts/${id}`, data),
  deleteAccount: (id) => api.delete(`/accounts/${id}`)
};

// Investments APIs
export const investmentsAPI = {
  getInvestments: () => api.get('/investments'),
  createInvestment: (data) => api.post('/investments', data),
  updateInvestment: (id, data) => api.put(`/investments/${id}`, data),
  deleteInvestment: (id) => api.delete(`/investments/${id}`)
};

// Crypto APIs
export const cryptoAPI = {
  getCryptos: () => api.get('/crypto'),
  createCrypto: (data) => api.post('/crypto', data),
  updateCrypto: (id, data) => api.put(`/crypto/${id}`, data),
  deleteCrypto: (id) => api.delete(`/crypto/${id}`)
};

export default api;