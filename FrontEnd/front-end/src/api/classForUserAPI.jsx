import axios from "axios";
import config from "../config";

const baseURL = config.apibackend + "/class";

const getToken = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : "";
  } catch (error) {
    return "";
  }
};

const ClassForUser = {
  getClasses: () => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.get(`${baseURL}`, { headers });
    } catch (error) {
      console.error("Error fetching users: ");
      return Promise.reject(error);
    }
  },
  addClass: (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.post(`${baseURL}/addClass`, data, { headers });
    } catch (error) {
      console.error("An error occurred");
      return Promise.reject(error);
    }
  },
  updateClass: (id, data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.put(`${baseURL}/updateClass/${id}`, data, { headers });
    } catch (error) {
      console.error("An error occurred");
      return Promise.reject(error);
    }
  },
  deleteClass: (id) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.delete(`${baseURL}/${id}`, { headers });
    } catch (error) {
      console.error("An error occurred");
      return Promise.reject(error);
    }
  },
};
export default ClassForUser;
