import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://backendofaswamithra-production.up.railway.app/api/v1";

/* ─── Token helpers ─── */
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

/* ─── Axios instance ─── */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

/* ─── Request interceptor: attach token ─── */
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ─── Response interceptor: auto-refresh on 401 ─── */
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                clearTokens();
                window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;
                setTokens(newAccessToken, newRefreshToken);
                processQueue(null, newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearTokens();
                window.location.href = "/";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

/* ─── Upload service ─── */
// export const uploadImage = async (file: File) => {
//     const formData = new FormData();
//     formData.append("image", file);

//     // We intentionally don't set Content-Type header here, 
//     // axios/browser will automatically set it to multipart/form-data with boundary
//     const response = await api.post("/upload", formData);
//     return response.data;
// };
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    // Use "image" to match your backend req.file
    formData.append("image", file);

    const response = await api.post("/upload", formData, {
        headers: {
            // This is the critical part to override your global JSON header
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


export default api;
