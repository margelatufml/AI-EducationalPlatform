import axios from "axios";
import config from "../config";
const BASE_URL = config.apibackend;

const getToken = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : "";
  } catch (error) {
    return "";
  }
};

const LoginAPI = {
  login: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/welcome/login`, data);
      return response;
    } catch (error) {
      console.error("An error occurred during login: ");
      throw error;
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      const config = {
        headers: {
          Authorization: `${refreshToken}`,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/welcome/refresh`,
        {},
        config
      );
      return response;
    } catch (error) {
      console.error("An error occurred during token refresh: ");
      throw error;
    }
  },
  logout: async () => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      const response = await axios.post(
        `${BASE_URL}/welcome/logout`,
        {},
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("An error occurred during logout: ");
      throw error;
    }
  },
};

export default LoginAPI;
