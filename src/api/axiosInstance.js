import axios from "axios";
import { store } from "../redux/store";
import { setCredentials, logout } from "../redux/slices/authSlice";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// ── Request interceptor: Attach access token from Redux ─────────────────────
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: Silent token refresh on 401 ───────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isTokenExpired =
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/refresh");

        if (isTokenExpired) {
            originalRequest._retry = true;

            try {
                // Browser automatically sends the HttpOnly refresh-token cookie
                const response = await axios.post(
                    `${API_BASE || "http://localhost:2025"}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data;

                // Push new token into Redux (also persisted to localStorage)
                store.dispatch(setCredentials({ accessToken }));

                // Retry the original request with the refreshed token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch {
                // Refresh token is expired / revoked → force logout
                store.dispatch(logout());
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
