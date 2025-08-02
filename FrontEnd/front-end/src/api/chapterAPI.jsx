import axios from "axios";
import config from "../config";
const BASE_URL = config.apibackend + "/chapters";

const getToken = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : "";
  } catch (error) {
    return "";
  }
};
const chapterAPI = {
  chaptersToDo: (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };
      return axios.get(`${BASE_URL}/chaptersStaredByUser/${data}`, { headers });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  chaptersFinish: (data) => {
    try {
      const token = getToken();

      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };

      return axios.get(`${BASE_URL}/chaptersFinishByUser/${data}`, { headers });
    } catch (error) {
      console.error("An error occurred");
      throw error;
    }
  },
  chapters: () => {
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
      throw error;
    }
  },
  addChapter: async (data) => {
    try {
      const token = getToken();
      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };
      const response = await axios.post(`${BASE_URL}/addChapter`, data, {
        headers,
      });
      return response;
    } catch (error) {
      console.error("An error occurred during adding chapters: ");
      throw error;
    }
  },
  updateChapter: async (id, data) => {
    try {
      const token = getToken();
      if (!token) {
        return Promise.reject(new Error("Access token not found"));
      }

      const headers = {
        Authorization: token,
      };
      const response = await axios.put(
        `${BASE_URL}/updateChapter/${id}`,
        data,
        { headers }
      );
      return response;
    } catch (error) {
      console.error("An error occurred during updating chapters: ");
      throw error;
    }
  },
  deleteChapter: (id) => {
    try {
      const headers = {
        Authorization: getToken(),
      };
      return axios.delete(`${BASE_URL}/${id}`, { headers });
    } catch (error) {
      console.error("Error deleting chapters: ");
      return Promise.reject(error);
    }
  },
};

export default chapterAPI;
