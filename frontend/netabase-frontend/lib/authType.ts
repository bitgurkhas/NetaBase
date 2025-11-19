// lib/auth-types.ts or types/auth.ts

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  picture?: string;
  // Add any other user fields your API returns
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface AuthActions {
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  resetInitialization: () => void;
  checkAuth: () => boolean;
}