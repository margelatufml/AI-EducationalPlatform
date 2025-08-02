import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../config";
const baseURL = config.apibackend;

const getToken = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : "";
  } catch (error) {
    return "";
  }
};

const UserAPI = {
  getUsers: () => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.get(`${baseURL}/user`, { headers });
    } catch (error) {
      console.error("Error fetching users: ");
      return Promise.reject(error);
    }
  },

  getUserById: () => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const userId = jwtDecode(token).userId;

      const headers = {
        Authorization: token,
      };

      return axios.get(`${baseURL}/user/${userId}`, { headers });
    } catch (error) {
      console.error("Error fetching user");
      return Promise.reject(error);
    }
  },

  updateUser: (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const userId = jwtDecode(token).userId;

      const headers = {
        Authorization: token,
      };

      return axios.put(`${baseURL}/user/${userId}`, data, { headers });
    } catch (error) {
      console.error("Error updating user");
      return Promise.reject(error);
    }
  },
  deleteUser: (userId) => {
    try {
      const headers = {
        Authorization: getToken(),
      };
      return axios.delete(`${baseURL}/user/${userId}`, { headers });
    } catch (error) {
      console.error("Error deleting user");
      return Promise.reject(error);
    }
  },
  setClassForUser: (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }
      const headers = {
        Authorization: token,
      };

      return axios.put(`${baseURL}/user/addClassForUser`, data, { headers });
    } catch (error) {
      console.error("An error occurred");
      return Promise.reject(error);
    }
  },
};

export default UserAPI;
