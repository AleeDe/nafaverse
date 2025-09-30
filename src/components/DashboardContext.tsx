import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Lang = 'en' | 'ur';
type User = { username?: string | null; email?: string | null } | null;

interface DashboardContextType {
  // UI
  dashboardOpen: boolean;
  setDashboardOpen: (open: boolean) => void;
  currentLanguage: Lang;
  setCurrentLanguage: (lang: Lang) => void;

  // Auth modal state
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  isLoginMode: boolean; // true=login, false=signup
  setIsLoginMode: (isLogin: boolean) => void;
  forgotPasswordModalOpen: boolean;
  setForgotPasswordModalOpen: (open: boolean) => void;

  // Auth data
  token: string | null;
  user: User;
  isAuthenticated: boolean;

  // Helpers
  refreshAuthFromStorage: () => void;
  logout: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  // UI
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Lang>('en');

  // Auth modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  // Auth data (localStorage only)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User>(() => ({
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
  }));

  const refreshAuthFromStorage = () => {
    setToken(localStorage.getItem('token'));
    setUser({
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
    });
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    } catch {}
    setToken(null);
    setUser({ username: null, email: null });
    setDashboardOpen(false);
    setLoginModalOpen(false);
    setIsLoginMode(true);
    window.dispatchEvent(new Event('nafa-auth-updated'));
    window.location.replace('/'); // redirect to homepage
  };

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

  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <DashboardContext.Provider
      value={{
        // UI
        dashboardOpen,
        setDashboardOpen,
        currentLanguage,
        setCurrentLanguage,
        // Modals
        loginModalOpen,
        setLoginModalOpen,
        isLoginMode,
        setIsLoginMode,
        forgotPasswordModalOpen,
        setForgotPasswordModalOpen,
        // Auth
        token,
        user,
        isAuthenticated,
        // Helpers
        refreshAuthFromStorage,
        logout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}