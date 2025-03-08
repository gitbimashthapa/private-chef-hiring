import axios from 'axios';

// Base URL
const API_URL = 'http://localhost:5000/api';

// Chef services
export const getChefs = async () => {
  try {
    const response = await axios.get(`${API_URL}/chefs`);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getChefById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/chefs/${id}`);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const createChefProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL}/chefs`, profileData);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const updateAvailability = async (availability) => {
  try {
    const response = await axios.put(`${API_URL}/chefs/availability`, { availability });
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Booking services
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getClientBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/client`);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getChefBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/chef`);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/bookings/${id}`, { status });
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Admin services
export const deleteChefProfile = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/chefs/${id}`);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};