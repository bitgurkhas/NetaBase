import { useEffect, useRef } from "react";
import { useAuthStore } from "../services/useAuthStore";

export default function AuthInitializer({ children }) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log("[AuthInitializer] Starting auth check...");
      initializeAuth();
    }
  }, []);
  return children;
}
