import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from "../../constants/constants";

const navigate = useNavigate();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // import environment variable from .env to make requests
}) 

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }, (error) => {

        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
        return Promise.reject(error);
    }
)

export default api;