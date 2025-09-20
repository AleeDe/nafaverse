import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { handleGoogleOAuthCallback } from './api/apiService';
import { useDashboard } from './components/DashboardContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPassword } from './components/ResetPassword';
import { DashboardProvider } from './components/DashboardContext';
import { Toaster } from 'sonner';
import { LoginModal } from './components/LoginModal';
import { ForgotPassword } from './components/ForgotPassword';

function AuthBootstrap() {
  const { refreshAuthFromStorage } = useDashboard();
  useEffect(() => {
    // Handle token returned by Google on safe paths
    handleGoogleOAuthCallback().finally(() => {
      // Pull token/username/email from cookies/localStorage into context
      refreshAuthFromStorage();
    });
  }, []);
  return null;
}

function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <DashboardProvider>
      <BrowserRouter>
        <AuthBootstrap /> {/* ensure this is mounted inside the provider */}
        <Toaster position="top-center" />
        <Navigation />
        <LoginModal />
        <ForgotPassword />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                refs={{ heroRef, journeyRef, graphRef, learnRef, ctaRef }}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}

export default App;