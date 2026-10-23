import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (phone_number, password) => {
    const formData = new URLSearchParams();
    formData.append('username', phone_number);
    formData.append('password', password);
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  register: async (registrationData) => {
    const response = await api.post('/auth/register', registrationData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const soilService = {
  getLayers: async (district = 'Tirupati') => {
    const response = await api.get(`/soil/layers?district=${encodeURIComponent(district)}`);
    return response.data;
  },

  getIntel: async (mandal) => {
    const response = await api.get(`/soil/intel?mandal=${encodeURIComponent(mandal)}`);
    return response.data;
  }
};

export const cropService = {
  getRecommendations: async () => {
    const response = await api.get('/crops/recommend');
    return response.data;
  }
};

export const diseaseService = {
  diagnose: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/disease/diagnose', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default api;