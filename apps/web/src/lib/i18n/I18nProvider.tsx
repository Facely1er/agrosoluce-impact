/**
 * Internationalization Provider
 * Manages language state and provides translations
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // Get initial language from localStorage or browser preference
  const getInitialLanguage = (): Language => {
    // Check localStorage first (only in browser environment)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agrosoluce-language') as Language;
      if (saved && (saved === 'en' || saved === 'fr')) {
        return saved;
      }
      
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') {
        return 'fr';
      }
    }
    
    // Default to English
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Persist to localStorage (only in browser environment)
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrosoluce-language', lang);
    }
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  // Update HTML lang attribute on mount and language change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    // Ensure localStorage is in sync
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agrosoluce-language') as Language;
      if (saved !== language) {
        localStorage.setItem('agrosoluce-language', language);
      }
    }
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

