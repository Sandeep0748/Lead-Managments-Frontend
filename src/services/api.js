import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Lead API
export const leadAPI = {
  submit: (data) => apiClient.post('/api/leads/submit', data),
  getAll: (params) => apiClient.get('/api/leads/all', { params }),
  getOne: (id) => apiClient.get(`/api/leads/${id}`),
  updateStatus: (id, status) => apiClient.patch(`/api/leads/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/api/leads/${id}`),
};

// Auth API
export const authAPI = {
  login: (email, password) => apiClient.post('/api/auth/login', { email, password }),
  register: (data) => apiClient.post('/api/auth/register', data),
};

export default apiClient;
