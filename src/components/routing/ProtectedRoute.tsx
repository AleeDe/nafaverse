import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDashboard } from '../DashboardContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useDashboard();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}