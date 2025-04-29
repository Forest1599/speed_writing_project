import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/constants";
import { jwtDecode } from 'jwt-decode';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // import environment variable from .env to make requests
}) 

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
  
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp && decoded.exp < now) {
            // Token expired
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            window.location.href = '/'; // redirect
            return Promise.reject(new Error("Access token expired"));
          }
  
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );

export default api;