// src/services/sweetService.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api/sweets', // Base path for all sweet-related APIs
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



export const getSweets = async () => {
  const response = await api.get('/');
  return response.data;
};


export const getSweetById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};


export const searchSweets = async (query, category, minPrice, maxPrice) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (category) params.append('category', category);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);

  const response = await api.get(`/search?${params.toString()}`);
  return response.data;
};

export const addSweet = async (sweet) => {
  const response = await api.post('/', sweet);
  return response.data;
};

export const updateSweet = async (id, sweet) => {
  const response = await api.put(`/${id}`, sweet);
  return response.data;
};

export const deleteSweet = async (id) => {
  await api.delete(`/${id}`);
};

export const restockSweet = async (id, quantity) => {
  const response = await api.put(`/${id}/restock`, { quantity });
  return response.data;
};

export const purchaseSweet = async (id, quantity = 1) => {
  const response = await api.post(`/${id}/purchase`, { quantity });
  return response.data;
};

export default api;
