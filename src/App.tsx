import React, { useEffect, useRef, useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { handleGoogleOAuthCallback } from './api/apiService';
import { useDashboard } from './components/DashboardContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPassword } from './components/ResetPassword';
import { GoalSimulationPage } from './pages/GoalSimulationPage';
import { DashboardProvider } from './components/DashboardContext';
import { Toaster } from 'sonner';
import { LoginModal } from './components/LoginModal';
import ForgotPassword from './components/ForgotPassword';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import MoneyTrackingPage from './pages/MoneyTrackingPage';
import GrowAndLearnPage from './pages/GrowAndLearnPage';

// Custom Cursor Component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.classList.contains('hover-target') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''}`}
      style={{
        left: `${position.x - 8}px`,
        top: `${position.y - 8}px`,
      }}
    />
  );
}

function AuthBootstrap() {
  const { refreshAuthFromStorage, setLoginModalOpen, setIsLoginMode } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const handled = await handleGoogleOAuthCallback(); // parses token & calls getMe
      if (handled && mounted) {
        refreshAuthFromStorage();
        setIsLoginMode(true);
        setLoginModalOpen(false);
        // Force router navigation so homepage mounts properly
        navigate('/', { replace: true });
      }
    })();

    const onUnauthorized = () => {
      if (!mounted) return;
      setIsLoginMode(true);
      setLoginModalOpen(true);
    };
    window.addEventListener('nafa-auth-unauthorized', onUnauthorized);
    return () => {
      mounted = false;
      window.removeEventListener('nafa-auth-unauthorized', onUnauthorized);
    };
  }, [refreshAuthFromStorage, setLoginModalOpen, setIsLoginMode, navigate]);

  return null;
}

function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const onScrollToSection = useCallback((section: string) => {
    const refs = {
      hero: heroRef,
      journey: journeyRef,
      graph: graphRef,
      learn: learnRef,
      cta: ctaRef,
    };
    
    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <DashboardProvider>
      <CustomCursor />
      <BrowserRouter>
        <AuthBootstrap /> {/* ensure this is mounted inside the provider */}
        <Toaster position="top-center" />
        <Navigation onScrollToSection={onScrollToSection} />
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/coming-soon" 
            element={
              <div style={{ position: 'relative', zIndex: 9999 }}>
                <ComingSoonPage />
              </div>
            } 
          />
          <Route
            path="/goal-simulation"
            element={
              <ProtectedRoute>
                <GoalSimulationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/money-tracking" element={<MoneyTrackingPage />} />
          <Route path="/coming-soon" element={<GrowAndLearnPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
        </Routes>
        {/* Only show footer on non-coming-soon pages */}
        <Routes>
          <Route path="/coming-soon" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}

export default App;