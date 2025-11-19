import { User } from "@/types";

export interface AuthActions {
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  resetInitialization: () => void;
  checkAuth: () => boolean;
}