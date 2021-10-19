import Axios from "axios";
import { clearToken, getToken } from "./utils/authStorage";

const axios = Axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL });

axios.interceptors.request.use((config) => {
  const token = getToken();
  config.headers.authorization = token ? `Token ${token}` : undefined;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearToken();
      window.location.assign("/");
    }

    const errorData = error ? error?.response?.data : error;
    return Promise.reject(errorData);
  }
);

export default axios;
