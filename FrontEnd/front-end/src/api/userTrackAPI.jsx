import axios from "axios";
import config from "../config";
const BASE_URL = config.apibackend + "/userProgress";

const getToken = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : "";
  } catch (error) {
    return "";
  }
};

const userTrackAPI = {
  correctExercices: async (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.post(`${BASE_URL}/correctExercices`, data, { headers });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  mesajMaiUsor: async (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.post(`${BASE_URL}/mesajMaiUsor`, data, { headers });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },

  topUsersScore: async () => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.get(`${BASE_URL}/top3Scores`, { headers });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  generateExercisesWithGPT: async (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.post(`${BASE_URL}/createExercisesFromGPT`, data, {
        headers,
      });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  getTrackForUser: async () => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.get(`${BASE_URL}/getTrackForUser`, { headers });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  getCountForUser: async (chapterId) => {
    try {
      const token = getToken();
      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.post(`${BASE_URL}/getCountForUser`, null, {
        headers,
        params: { chapterId },
      });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
};

export default userTrackAPI;
