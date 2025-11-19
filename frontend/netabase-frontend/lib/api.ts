import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "./useAuthStore";

// Get base URL from Next.js environment variable
const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Shared promise to prevent multiple simultaneous refresh attempts
let refreshPromise: Promise<string> | null = null;

// Request interceptor - attach access token to every outgoing request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - automatically refresh expired tokens and retry failed requests
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors on the first retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Wait for any in-progress refresh to complete
      if (refreshPromise) {
        try {
          await refreshPromise;
          const token = useAuthStore.getState().accessToken;
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      // Initiate token refresh using httpOnly refresh cookie
      refreshPromise = (async (): Promise<string> => {
        try {
          const refreshRes = await axios.post<{ access: string }>(
            `${BASE_URL}/api/token/refresh/`,
            {},
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
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
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;