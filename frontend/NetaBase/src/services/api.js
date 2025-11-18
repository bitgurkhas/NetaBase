import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Shared promise to prevent multiple simultaneous refresh attempts
let refreshPromise = null;

// Attach access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh expired tokens and retry failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors on the first retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Wait for any in-progress refresh to complete
      if (refreshPromise) {
        try {
          await refreshPromise;
          const token = useAuthStore.getState().accessToken;
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch {
          return Promise.reject(error);
        }
      }

      // Initiate token refresh using httpOnly refresh cookie
      refreshPromise = (async () => {
        try {
          const refreshRes = await axios.post(
            `${BASE_URL}/api/token/refresh/`,
            {},
            { 
              withCredentials: true,
              headers: { "Content-Type": "application/json" }
            }
          );

          const newAccess = refreshRes.data.access;
          useAuthStore.getState().setAccessToken(newAccess);
          return newAccess;
        } catch (refreshError) {
          // Clear authentication state on refresh failure
          const store = useAuthStore.getState();
          store.setAccessToken(null);
          store.setUser(null);
          throw refreshError;
        } finally {
          refreshPromise = null;
        }
      })();

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;