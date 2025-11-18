import { create } from "zustand";
import api from "./api";

// Global promise to prevent duplicate initialization requests
let initPromise = null;

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: !!token,
    }),

  setUser: (user) => set({ user }),

  login: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isInitialized: true,
    }),

  logout: async () => {
    try {
      await api.post("/api/logout/");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },

  // Initialize auth by checking refresh token
  initializeAuth: async () => {
    const state = get();

    // If already initialized or initializing, return the existing promise
    if (state.isInitialized) {
      console.log("[Auth] Already initialized, skipping");
      return;
    }

    if (initPromise) {
      console.log("[Auth] Initialization in progress, waiting...");
      return initPromise;
    }

    console.log("[Auth] Starting initialization...");

    initPromise = (async () => {
      try {
        // Try to get user info
        const res = await api.get("/api/me/");
        set({
          user: res.data,
          isAuthenticated: true,
          isInitialized: true,
        });
        console.log("[Auth] Initialization successful");
      } catch (err) {
        console.log("[Auth] Initialization failed - user not authenticated");
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  },

  resetInitialization: () => {
    initPromise = null;
    set({ isInitialized: false });
  },

  checkAuth: () => {
    const state = get();
    return state.isAuthenticated && state.user;
  },
}));
