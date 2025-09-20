import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sweetsAPI = {
  // Get all sweets
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sweets`, {
        ...getAuthHeader(),
        params,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to fetch sweets");
      } else {
        throw new Error("Network error. Please try again.");
      }
    }
  },

  // Search sweets
  search: async (searchParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sweets/search`, {
        ...getAuthHeader(),
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Search failed");
      } else {
        throw new Error("Network error. Please try again.");
      }
    }
  },

  // Get sweet by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sweets/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to fetch sweet");
      } else {
        throw new Error("Network error. Please try again.");
      }
    }
  },

  // Purchase sweet
  purchase: async (id, quantity = 1) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/sweets/${id}/purchase`,
        { quantity },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to purchase sweet");
      } else {
        throw new Error("Network error. Please try again.");
      }
    }
  },

  // Restock sweet (Admin only)
  restock: async (id, quantity) => {
    if (!quantity || quantity <= 0) throw new Error("Quantity must be a positive number");
    try {
      const response = await axios.put(
        `${API_BASE_URL}/sweets/${id}/restock`,
        { quantity },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to restock sweet");
      } else {
        throw new Error("Network error. Please try again.");
      }
    }
  },

  // Add a new sweet (Admin only)
  addSweet: async (sweetData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sweets`, sweetData, getAuthHeader());
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to add sweet");
      } else {
        throw new Error("Network error. Please try again.");
      }
    }
  },
};
