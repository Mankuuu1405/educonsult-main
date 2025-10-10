// src/api/axios.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    // --- THE FIX ---
    // This tells Axios to include cookies on all cross-origin requests
    withCredentials: true, 
});

export default axiosInstance;