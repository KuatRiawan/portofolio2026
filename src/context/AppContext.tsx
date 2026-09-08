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
  isLoadingMessages: boolean;
  apiError: string | null;
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

  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch messages from Vercel Serverless API on mount and setup polling
  useEffect(() => {
    const fetchMessages = async (isInitial = false) => {
      try {
        if (isInitial) setIsLoadingMessages(true);
        // Cache bust the GET request so the browser doesn't return stale data
        const res = await fetch('/api/messages?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setGuestMessages((prev) => {
              // Prevent unnecessary re-renders if data hasn't changed
              if (prev.length !== data.length || JSON.stringify(prev) !== JSON.stringify(data)) {
                return data;
              }
              return prev;
            });
          } else if (isInitial) {
            // Seed with mock messages if DB is empty
            setGuestMessages([
              { id: 'guest-init-1', name: 'John Doe', message: 'Wah UI mesin capitnya keren banget! Semangat terus mas Kuat 💪', color: '#f59e0b' },
              { id: 'guest-init-2', name: 'UI/UX Tester', message: 'Animasi 3D-nya smooth, detail shadow-nya dapet. Nice work!', color: '#ec4899' },
              { id: 'guest-init-3', name: 'HR Recruiter', message: 'CV yang sangat interaktif dan out of the box!', color: '#3b82f6' }
            ]);
          }
        }
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        if (isInitial) setApiError('GET ERROR: ' + error.message);
      } finally {
        if (isInitial) setIsLoadingMessages(false);
      }
    };
    
    fetchMessages(true);
    
    // Poll for new messages every 3 seconds for faster real-time updates
    const intervalId = setInterval(() => {
      fetchMessages(false);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

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

  const addGuestMessage = async (msg: GuestMessage) => {
    // Optimistic UI update
    setGuestMessages((prev) => [...prev, msg]);
    
    // Save to DB
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setApiError('POST ERROR: ' + res.status + ' ' + (errData.error || res.statusText));
      }
    } catch (e: any) {
      console.error('Failed to save message', e);
      setApiError('POST EXCEPTION: ' + e.message);
    }
  };

  const removeGuestMessage = async (id: string) => {
    // Optimistic UI update
    setGuestMessages((prev) => prev.filter(msg => msg.id !== id));
    
    // Delete from DB
    try {
      await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error('Failed to delete message', e);
    }
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, toggleLang, t, guestMessages, isLoadingMessages, apiError, addGuestMessage, removeGuestMessage }}>
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
