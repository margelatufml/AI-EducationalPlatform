import axios from "axios";
import config from "../config";
const BASE_URL = config.apibackend + "/subject";

const getToken = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? `Bearer ${accessToken}` : "";
  } catch (error) {
    return "";
  }
};

const SubjectAPI = {
  getAll: () => {
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
      console.error("Error fetching subjects: ");
      return Promise.reject(error);
    }
  },
};
export default SubjectAPI;
