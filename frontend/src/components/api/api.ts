import axios from "axios";
import { ACCESS_TOKEN } from "../../constants/constants";

// Used for local requests but probably will have to change this to domain name
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // import environment variable from .env
}) 

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    }
)

export default api;