'use client';

import { LanguageProvider } from "@/context/LanguageContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode, useEffect } from "react";
import Header from "@/components/Header";
import { useAuthStore } from "@/lib/useAuthStore";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LanguageProvider>
        <AuthInitializer />
        <Header />
        {children}
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}