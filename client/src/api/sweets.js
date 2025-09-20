import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const sweetsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sweets`, {
        ...getAuthHeader(),
        params
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

  search: async (searchParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sweets/search`, {
        ...getAuthHeader(),
        params: searchParams
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

  purchase: async (id, quantity = 1) => {
    console.log(id)
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
  }
};

export const addSweet = async (sweetData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/sweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(sweetData),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};
