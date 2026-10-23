import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('krishi_lang') || 'te';
  });

  useEffect(() => {
    localStorage.setItem('krishi_lang', lang);
  }, [lang]);

  const toggleLanguage = (selectedLang) => {
    setLang(selectedLang);
  };

  const t = translations[lang] || translations.te;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);