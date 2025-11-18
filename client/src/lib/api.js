import axios from 'axios';

// Single axios instance for the app
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Helper for fetch() calls to attach Authorization header
export const getAuthHeaders = (withJson = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (withJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export default api;
