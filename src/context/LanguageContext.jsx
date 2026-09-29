import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('cg_fssm_language') || 'hi'; // Default Hindi
  });

  useEffect(() => {
    localStorage.setItem('cg_fssm_language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Translate helper
  const t = (key) => {
    const currentDict = TRANSLATIONS[lang] || TRANSLATIONS.hi;
    return currentDict[key] || TRANSLATIONS.en[key] || key;
  };

  const languages = [
    { code: 'hi', label: 'हिन्दी', sublabel: 'Hindi' },
    { code: 'en', label: 'English', sublabel: 'English' },
    { code: 'hne', label: 'छत्तीसगढ़ी', sublabel: 'Chhattisgarhi' }
  ];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
