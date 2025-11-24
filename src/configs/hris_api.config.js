import axios from "axios";

const hris_api = axios.create({
  baseURL: import.meta.env.VITE_HRIS_BACKEND_URL,
  withCredentials: false,
});

hris_api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default hris_api;
