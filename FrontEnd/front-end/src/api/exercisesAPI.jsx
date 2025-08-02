import axios from "axios";
import config from "../config";

const BASE_URL = config.apibackend + "/exercices";

const getToken = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : "";
  } catch (error) {
    return "";
  }
};

const exercisesAPI = {
  getRandomExercises: async (chapterId) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };
      const response = await axios.get(
        `${BASE_URL}/getExercices/${chapterId}`,
        { headers }
      );
      return response;
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  addExercises: async (exercisesRequest) => {
    try {
      const token = getToken();
      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };
      const response = await axios.post(
        `${BASE_URL}/addExercices`,
        exercisesRequest,
        { headers }
      );
      return response;
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  updateExercises: async (id, exercisesRequest) => {
    try {
      const token = getToken();
      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };
      const response = await axios.put(
        `${BASE_URL}/updateExercices/${id}`,
        exercisesRequest,
        { headers }
      );
      return response;
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  deleteExercises: (id) => {
    try {
      const headers = {
        Authorization: getToken(),
      };
      return axios.delete(`${BASE_URL}/deleteExercices/${id}`, { headers });
    } catch (error) {
      console.error("An error occurred");
      return Promise.reject(error);
    }
  },
  getExercices: () => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.get(`${BASE_URL}`, { headers });
    } catch (error) {
      console.error("An error occurred");
      return Promise.reject(error);
    }
  },
  getRemainingTime: async () => {
    try {
      const token = getToken();
      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.get(`${BASE_URL}/getRemainingTime`, {
        headers,
      });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
};

export default exercisesAPI;
