"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '@/lib/storage';
import uz from '@/locales/uz.json';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';

const translations = { uz, en, ru };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uz');

  useEffect(() => {
    const savedLanguage = storage.get('language', 'uz');
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      storage.set('language', lang);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (!result) {
        // Fallback to uzbek if key not found
        let fallbackResult = translations['uz'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
