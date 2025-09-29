import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import { useDashboard } from '../DashboardContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { setLoginModalOpen, setIsLoginMode } = useDashboard();
  const [status, setStatus] = useState<'checking' | 'granted' | 'denied'>('checking');

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      if (mounted) setStatus('denied');
      return;
    }
    (async () => {
      try {
        await apiService.getMe();
        if (mounted) setStatus('granted');
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        if (mounted) setStatus('denied');
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname]);

  if (status === 'checking') return <div style={{ padding: 24, textAlign: 'center' }}>Checking session…</div>;

  if (status === 'denied') {
    setIsLoginMode?.(true);
    setLoginModalOpen?.(true);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}