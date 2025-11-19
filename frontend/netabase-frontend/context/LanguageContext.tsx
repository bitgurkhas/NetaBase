"use client"
import { createContext, useState, useContext, ReactNode } from 'react';
import { translations, defaultLanguage } from '../locales';

interface LanguageContextType {
  language: string;
  switchLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<string>(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || defaultLanguage;
    }
    return defaultLanguage;
  });

  const switchLanguage = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      if (lang === 'ne') {
        document.documentElement.dir = 'ltr'; // Nepali is LTR
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    for (let k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}