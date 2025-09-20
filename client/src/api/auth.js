import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; 

export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      email,
      password
    });
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error("Network error. Please try again.");
    }
  }
};

// Login API
export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Login failed");
    else throw new Error("Network error. Please try again.");
  }
};
