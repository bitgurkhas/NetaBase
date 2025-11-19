export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
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