import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const axiosinstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Response interceptor with basic retry for transient/network/5xx errors
axiosinstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        console.log("API ERROR:", error.response?.data || error.message);

        // If there's no config or we've already retried too many times, reject
        if (!config) return Promise.reject(error);

        config._retry = config._retry || 0;

        const shouldRetry =
            (!error.response || error.response.status >= 500) ||
            error.code === 'ECONNABORTED' ||
            error.message?.includes('Network Error');

        if (shouldRetry && config._retry < 3) {
            config._retry += 1;
            // exponential-ish backoff
            const delay = 300 * config._retry;
            await new Promise((res) => setTimeout(res, delay));
            return axiosinstance(config);
        }

        return Promise.reject(error);
    }
);