import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language } from '../i18n/translations';
import type { GuestMessage } from '../types/portfolio';

export type Theme = 'dark' | 'light';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof translations['id'];
  guestMessages: GuestMessage[];
  addGuestMessage: (msg: GuestMessage) => void;
  removeGuestMessage: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state persisted in localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Language state persisted in localStorage
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>(() => {
    const saved = localStorage.getItem('app_guest_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default seed messages for empty state
    return [
      { id: 'guest-init-1', name: 'John Doe', message: 'Wah UI mesin capitnya keren banget! Semangat terus mas Kuat 💪', color: '#f59e0b' },
      { id: 'guest-init-2', name: 'UI/UX Tester', message: 'Animasi 3D-nya smooth, detail shadow-nya dapet. Nice work!', color: '#ec4899' },
      { id: 'guest-init-3', name: 'HR Recruiter', message: 'CV yang sangat interaktif dan out of the box!', color: '#3b82f6' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('app_guest_messages', JSON.stringify(guestMessages));
  }, [guestMessages]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const addGuestMessage = (msg: GuestMessage) => {
    setGuestMessages((prev) => [...prev, msg]);
  };

  const removeGuestMessage = (id: string) => {
    setGuestMessages((prev) => prev.filter(msg => msg.id !== id));
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, toggleLang, t, guestMessages, addGuestMessage, removeGuestMessage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
