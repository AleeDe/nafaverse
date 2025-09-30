import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDashboard } from '../DashboardContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { setLoginModalOpen, setIsLoginMode } = useDashboard();
  const [status, setStatus] = useState<'checking' | 'granted' | 'denied'>('checking');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setStatus(token ? 'granted' : 'denied');
  }, [location.pathname]);

  if (status === 'checking') return null;

  if (status === 'denied') {
    setIsLoginMode?.(true);
    setLoginModalOpen?.(true);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}