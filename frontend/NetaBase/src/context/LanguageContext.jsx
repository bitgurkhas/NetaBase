import React, { createContext, useState, useContext } from 'react';
import { translations, defaultLanguage } from '../locales';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || defaultLanguage
  );

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    if (lang === 'ne') {
      document.documentElement.dir = 'ltr'; // Nepali is LTR
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}