import axios from "axios";

// const API_BASE_URL=import.meta.env.VITE_API_BASE_URl || "http://localhost:5000";

export const axiosinstance = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URl || "http://localhost:5000",
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosinstance.interceptors.response.use(
    (responce) => responce,
    (error) => {
        console.log("API ERROR:", error.responce?.data || error.meddage);
        return Promise.reject(error);
    }
);