// services/apiService.js
import axios from 'axios';

// Create an axios instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle expired token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};

// Chefs
export const getAllChefs = (filters = {}) => {
  return api.get('/chefs', { params: filters });
};

export const getChefById = (id) => {
  return api.get(`/chefs/${id}`);
};

export const searchChefs = (query) => {
  return api.get('/chefs/search', { params: { query } });
};

// Bookings
export const getUserBookings = () => {
  return api.get('/bookings/user');
};

export const getBookingById = (id) => {
  return api.get(`/bookings/${id}`);
};

export const createBooking = (bookingData) => {
  return api.post('/bookings', bookingData);
};

export const updateBooking = (id, bookingData) => {
  return api.put(`/bookings/${id}`, bookingData);
};

export const cancelBooking = (id, reason) => {
  return api.post(`/bookings/${id}/cancel`, { reason });
};

// Reviews
export const createReview = (reviewData) => {
  return api.post('/reviews', reviewData);
};

export const updateReview = (id, reviewData) => {
  return api.put(`/reviews/${id}`, reviewData);
};

export const deleteReview = (id) => {
  return api.delete(`/reviews/${id}`);
};

// User Profile
export const getUserProfile = () => {
  return api.get('/users/profile');
};

export const updateUserProfile = (userData) => {
  return api.put('/users/profile', userData);
};

export const changePassword = (passwordData) => {
  return api.post('/users/change-password', passwordData);
};

// For file uploads (e.g., profile photos)
export const uploadFile = (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default api;