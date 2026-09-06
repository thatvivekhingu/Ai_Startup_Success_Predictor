import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

export const predictionAPI = {
  getPresets: () => api.get('/api/presets'),
  predict: (data) => api.post('/api/predict', data),
  getHistory: () => api.get('/api/predictions/history'),
  getById: (id) => api.get(`/api/predictions/${id}`),
  deletePrediction: (id) => api.delete(`/api/predictions/${id}`),
};

export const analyticsAPI = {
  getModelMetrics: () => api.get('/api/analytics/model-metrics'),
  getIndustryStats: () => api.get('/api/analytics/industry-stats'),
  getSummary: () => api.get('/api/analytics/summary'),
};

export const gujaratAPI = {
  getNews: (limit = 12) => api.get(`/api/gujarat-ecosystem/news?limit=${limit}`),
  getSchemes: () => api.get('/api/gujarat-ecosystem/schemes'),
  getDistrictsAndHubs: () => api.get('/api/gujarat-ecosystem/districts-and-hubs'),
};

export default api;
