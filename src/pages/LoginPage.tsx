import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from '../components/DashboardContext';

export default function LoginPage() {
  const { setLoginModalOpen, setIsLoginMode, isAuthenticated } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoginMode(true);
    setLoginModalOpen(true);
  }, [setIsLoginMode, setLoginModalOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      const qs = new URLSearchParams(location.search);
      const next = qs.get('next') || '/';
      navigate(next, { replace: true });
    }
  }, [isAuthenticated, location.search, navigate]);

  return <div style={{ minHeight: '50vh' }} />;
}