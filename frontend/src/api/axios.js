import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" ||'https://final-year-project-placement-ai.onrender.com',
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("access_token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


export default api;