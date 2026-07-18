import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api',
  withCredentials: true, // Important for sending cookies with requests
});

// Request interceptor to attach auth token if needed
api.interceptors.request.use(
  (config) => {
    // You could add auth token here if using localStorage or sessionStorage
    // For now, we're relying on cookies which are sent automatically with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Service functions for different API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),

  logout: () =>
    api.post('/auth/logout'),

  getCurrentUser: () =>
    api.get('/auth/me')
};

export const accountsAPI = {
  getAccounts: () =>
    api.get('/accounts'),

  createAccount: (data: { sourceName: string; type: string; amount: number }) =>
    api.post('/accounts', data),

  updateAccount: (id: number, data: { sourceName: string; type: string; amount: number }) =>
    api.put(`/accounts/${id}`, data),

  deleteAccount: (id: number) =>
    api.delete(`/accounts/${id}`)
};

export const investmentsAPI = {
  getInvestments: () =>
    api.get('/investments'),

  createInvestment: (data: { sourceName: string; type: string; amount: number }) =>
    api.post('/investments', data),

  updateInvestment: (id: number, data: { sourceName: string; type: string; amount: number }) =>
    api.put(`/investments/${id}`, data),

  deleteInvestment: (id: number) =>
    api.delete(`/investments/${id}`)
};

export const cryptoAPI = {
  getCryptos: () =>
    api.get('/crypto'),

  createCrypto: (data: { sourceName: string; type: string; amount: number }) =>
    api.post('/crypto', data),

  updateCrypto: (id: number, data: { sourceName: string; type: string; amount: number }) =>
    api.put(`/crypto/${id}`, data),

  deleteCrypto: (id: number) =>
    api.delete(`/crypto/${id}`)
};