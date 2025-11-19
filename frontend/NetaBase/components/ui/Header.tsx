"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import icon from "@/assets/NetaBase.png";
import api from "@/services/api";
import { useAuthStore } from "../../hooks/useAuthStore";

interface NavigationItem {
  path: string;
  label: string;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get auth state from store
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  // Google Login Handler
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    
    if (!credential) {
      alert("No credential received from Google");
      return;
    }

    try {
      const res = await api.post("/api/google/login/", { credential });
      const { access, user } = res.data;
      
      login(access, user);
      router.push("/home");
    } catch (err: any) {
      console.error("Google login error:", err);
      alert(err.response?.data?.error || "Google login failed");
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const navigationItems: NavigationItem[] = [
    { path: "/home", label: "Home" },
    { path: "/events", label: "Events" },
    { path: "/party", label: "Party" },
    { path: "/news", label: "News" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/home"
            className="flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <Image 
              src={icon} 
              alt="NetaBase" 
              width={40}
              height={40}
              className="rounded-lg" 
            />
            <span className="text-lg sm:text-xl font-bold hidden sm:inline">
              NetaBase
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 ml-12">
            {navigationItems.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={`transition text-sm ${
                  pathname === path 
                    ? "text-white font-semibold" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auth Section */}
            {!isInitialized ? (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <div className="animate-pulse">Loading...</div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {user.full_name || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-900 rounded-lg transition text-sm text-red-400 hover:text-red-300"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:block">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => alert("Google login failed")}
                  theme="filled_black"
                  size="medium"
                />
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 hover:bg-gray-900 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="h-0.5 bg-white rounded"></span>
                <span className="h-0.5 bg-white rounded"></span>
                <span className="h-0.5 bg-white rounded"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-900">
            <nav className="flex flex-col gap-3 pt-4">
              {navigationItems.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-2 py-2 text-left transition ${
                    pathname === path
                      ? "text-white font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}

              {/* Auth mobile */}
              <div className="border-t border-gray-700 pt-3 mt-3">
                {!isInitialized ? (
                  <p className="text-gray-400 text-sm px-2 animate-pulse">
                    Loading...
                  </p>
                ) : isAuthenticated && user ? (
                  <>
                    <p className="text-gray-400 text-sm px-2 mb-2">
                      {user.full_name || user.username}
                    </p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-red-400 hover:text-red-300 px-2 py-2 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="px-2 py-2">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => alert("Google login failed")}
                      theme="filled_black"
                      size="medium"
                    />
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;