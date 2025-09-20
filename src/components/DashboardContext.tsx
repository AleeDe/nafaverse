import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiService } from '../api/apiService';

type Lang = 'en' | 'ur';
type User = { username?: string | null; email?: string | null } | null;

interface DashboardContextType {
  // UI
  dashboardOpen: boolean;
  setDashboardOpen: (open: boolean) => void;
  currentLanguage: Lang;
  setCurrentLanguage: (lang: Lang) => void;

  // Modals
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  isLoginMode: boolean;
  setIsLoginMode: (isLogin: boolean) => void;
  forgotPasswordModalOpen: boolean;
  setForgotPasswordModalOpen: (open: boolean) => void;

  // Auth
  token: string | null;
  user: User;
  isAuthenticated: boolean;
  refreshAuthFromStorage: () => void;
  logout: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
};

function readCookie(name: string): string | null {
  const list = document.cookie ? document.cookie.split('; ') : [];
  for (const pair of list) {
    const [k, ...rest] = pair.split('=');
    if (decodeURIComponent(k) === name) {
      const raw = rest.join('=');
      return decodeURIComponent(raw.replace(/\+/g, ' '));
    }
  }
  return null;
}

// Safely decode JWT
function decodeJwt(token: string | null) {
  try {
    if (!token) return null;
    const base64 = token.split('.')[1] || '';
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  // UI state
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Lang>('en');

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);

  const refreshAuthFromStorage = () => {
    const t = localStorage.getItem('token') || readCookie('token');
    let username = readCookie('username');
    let email = readCookie('email');

    // If name/email missing but token exists, try to derive from JWT
    if (t && !username && !email) {
      const payload: any = decodeJwt(t);
      const nameFromJwt =
        payload?.username || payload?.name || payload?.preferred_username || null;
      const emailFromJwt = payload?.email || null;

      if (nameFromJwt || emailFromJwt) {
        const maxAge = 60 * 60 * 24 * 7;
        if (nameFromJwt) {
          document.cookie = `username=${encodeURIComponent(nameFromJwt)}; path=/; max-age=${maxAge}`;
          username = String(nameFromJwt);
        }
        if (emailFromJwt) {
          document.cookie = `email=${encodeURIComponent(emailFromJwt)}; path=/; max-age=${maxAge}`;
          email = String(emailFromJwt);
        }
      }
    }

    setToken(t ?? null);
    setUser(t ? { username, email } : null);
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; Max-Age=0';
      document.cookie = 'username=; path=/; Max-Age=0';
      document.cookie = 'email=; path=/; Max-Age=0';
    } catch {}
    setToken(null);
    setUser(null);
    setDashboardOpen(false);
    setLoginModalOpen(false);
    // notify any listeners (optional)
    window.dispatchEvent(new Event('nafa-auth-updated'));
  };

  // Bootstrap from storage + listen for OAuth updates and storage changes
  useEffect(() => {
    refreshAuthFromStorage();
    const onAuthUpdated = () => refreshAuthFromStorage();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') refreshAuthFromStorage();
    };
    window.addEventListener('nafa-auth-updated', onAuthUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('nafa-auth-updated', onAuthUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // If we have a token but no display name/email yet, try to fetch once
  useEffect(() => {
    const needsMe = !!token && (!user || (!user.username && !user.email));
    if (!needsMe) return;
    apiService
      .getMe?.()
      ?.then((me: any) => {
        if (!me) return;
        const maxAge = 60 * 60 * 24 * 7;
        if (me.username) {
          document.cookie = `username=${encodeURIComponent(me.username)}; path=/; max-age=${maxAge}`;
        }
        if (me.email) {
          document.cookie = `email=${encodeURIComponent(me.email)}; path=/; max-age=${maxAge}`;
        }
        setUser({ username: me.username, email: me.email });
      })
      .catch(() => {});
  }, [token, user]);

  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <DashboardContext.Provider
      value={{
        dashboardOpen,
        setDashboardOpen,
        currentLanguage,
        setCurrentLanguage,
        loginModalOpen,
        setLoginModalOpen,
        isLoginMode,
        setIsLoginMode,
        forgotPasswordModalOpen,
        setForgotPasswordModalOpen,
        token,
        user,
        isAuthenticated,
        refreshAuthFromStorage,
        logout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}