"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useAuthStore } from "../hooks/useAuthStore";

interface AuthInitializerProps {
  children: ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const hasInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log("[AuthInitializer] Starting auth check...");
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  return <>{children}</>;
}