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
  // expose helpers
  refreshAuthFromStorage: () => void;
  logout: () => void; // <-- add
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
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

  // Auth state (from localStorage only)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User>(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    return {
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
    };
  });

  const refreshAuthFromStorage = () => {
    const t = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    let email = localStorage.getItem('email');

    // If name/email missing but token exists, try to derive from JWT and persist to localStorage
    if (t && (!username || !email)) {
      const payload: any = decodeJwt(t);
      const nameFromJwt = payload?.username || payload?.name || payload?.preferred_username || null;
      const emailFromJwt = payload?.email || null;

      if (!username && nameFromJwt) {
        username = String(nameFromJwt);
        localStorage.setItem('username', username);
      }
      if (!email && emailFromJwt) {
        email = String(emailFromJwt);
        localStorage.setItem('email', email);
      }
    }

    setToken(t ?? null);
    setUser(t ? { username: username ?? null, email: email ?? null } : null);
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    } catch {}
    setDashboardOpen(false);
    setLoginModalOpen(false);
    setIsLoginMode(true);
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event('nafa-auth-updated'));
    // Hard redirect to ensure a clean app state
    window.location.replace('/');
  };

  // Bootstrap from storage + listen for OAuth updates and storage changes
  useEffect(() => {
    refreshAuthFromStorage();
    const onAuthUpdated = () => refreshAuthFromStorage();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'username' || e.key === 'email') refreshAuthFromStorage();
    };
    window.addEventListener('nafa-auth-updated', onAuthUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('nafa-auth-updated', onAuthUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // If we have a token but no display name/email yet, fetch once and persist to localStorage
  useEffect(() => {
    const needsMe = !!token && (!user || (!user.username && !user.email));
    if (!needsMe) return;
    apiService
      .getMe?.()
      ?.then((me: any) => {
        if (!me) return;
        if (me.username) localStorage.setItem('username', String(me.username));
        if (me.email) localStorage.setItem('email', String(me.email));
        setUser({ username: me.username ?? null, email: me.email ?? null });
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
        logout, // <-- expose
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}