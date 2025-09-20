import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, Chrome } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from './ui/sheet';
import { LoginModal } from './LoginModal';
import { NafaVerseLogo } from './NafaVerseLogo';
import { useDashboard } from './DashboardContext';
import { apiService } from '../api/apiService';

export const Navigation: React.FC = () => {
  const {
    currentLanguage,
    setCurrentLanguage,
    setLoginModalOpen,
    setIsLoginMode,
    isAuthenticated,
    user,
    logout,
  } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const content = {
    en: {
      home: 'Home',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      signup: 'Sign Up',
      language: 'اردو',
    },
    // Roman Urdu labels
    ur: {
      home: 'Ghar',
      features: 'Khasoosiyat',
      about: 'Humare Bare Mein',
      contact: 'Raabta',
      login: 'Login',
      signup: 'Sign Up',
      language: 'English',
    }
  } as const;

  const t = content[currentLanguage] || content.en;

  const handleNavClick = (item: string) => {
    if (item === 'home') {
      navigate('/');
      onScrollToSection?.('hero');
    } else if (item === 'features') {
      navigate('/');
      setTimeout(() => onScrollToSection?.('journey'), 100);
    } else if (item === 'about') {
      navigate('/about');
    } else if (item === 'contact') {
      navigate('/contact');
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
  };

  // Example navigation items
  const navItems = [
    { label: t.home, path: '/' },
    { label: t.features, path: '/features' },
    { label: t.about, path: '/about' },
    { label: t.contact, path: '/contact' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black md:bg-black/20 md:backdrop-blur-md border-b border-white/10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 overflow-x-auto md:overflow-visible">
            {/* Logo */}
            <div className="flex items-center space-x-2 min-w-0">
              <NafaVerseLogo className="h-8 w-8" />
              <span className="text-xl font-bold text-white">NafaVerse</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 min-w-0">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/' ? 'text-[#00B8A9]' : 'text-white hover:text-[#00B8A9]'
                }`}
              >
                {t.home}
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="text-white hover:text-[#00B8A9] text-sm font-medium transition-colors duration-200"
              >
                {t.features}
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/about' ? 'text-[#00B8A9]' : 'text-white hover:text-[#00B8A9]'
                }`}
              >
                {t.about}
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/contact' ? 'text-[#00B8A9]' : 'text-white hover:text-[#00B8A9]'
                }`}
              >
                {t.contact}
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4 min-w-0">
              <Button
                onClick={handleLanguageToggle}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 border border-white/20"
              >
                {t.language}
              </Button>
              <div className="hidden sm:flex items-center space-x-2 min-w-0">
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsLoginMode(true);
                        setLoginModalOpen(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        setIsLoginMode(false);
                        setLoginModalOpen(true);
                      }}
                      variant="glow"
                      className="text-white"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white">
                      <User className="w-4 h-4 opacity-80" />
                      <span className="truncate max-w-[140px]">
                        {user?.username || user?.email || 'User'}
                      </span>
                    </div>
                    <Button onClick={logout} variant="ghost" className="text-white hover:bg-white/10">
                      Logout
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 border-none w-full max-w-xs overflow-x-hidden" >
                  {/* Gradient/Blob Background */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] overflow-hidden">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl opacity-20"></div>
                    <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                  </div>
                  <SheetHeader>
                    <SheetTitle className="text-white">Menu</SheetTitle>
                    <SheetDescription className="text-slate-300">
                      Navigate through NafaVerse
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-8 px-4 overflow-x-hidden">
                    <button
                      onClick={() => {
                        handleNavClick('home');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#00B8A9] text-left py-2"
                    >
                      {t.home}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('features');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#00B8A9] text-left py-2"
                    >
                      {t.features}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('about');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#00B8A9] text-left py-2"
                    >
                      {t.about}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#00B8A9] text-left py-2"
                    >
                      {t.contact}
                    </button>
                    {/* Get Started Button */}
                    <Button
                      onClick={() => {
                        setIsLoginMode(false); // Set to signup mode
                        setLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="mt-6 w-full bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] text-white font-bold text-lg py-3 rounded-xl shadow-lg"
                    >
                      Get Started
                    </Button>
                  </div>
                  {/* Login/Signup at Bottom */}
                  <div className="absolute bottom-0 left-0 w-full flex flex-col gap-2 px-4 pb-6 bg-gradient-to-t from-black/70 via-transparent to-transparent overflow-x-hidden">
                    {isAuthenticated ? (
                      <Button onClick={logout} className="w-full mt-6 bg-red-600 text-white">
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setIsLoginMode(true);
                            setLoginModalOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          variant="ghost"
                          className="w-full text-white border border-white/20"
                        >
                          {t.login}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsLoginMode(false);
                            setLoginModalOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          variant="glow"
                          className="w-full text-white"
                        >
                          {t.signup}
                        </Button>
                        {/* Google Login (mobile) */}
                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            apiService.googleLogin();
                          }}
                          variant="ghost"
                          className="w-full text-white border border-white/20"
                        >
                          <Chrome className="w-4 h-4 mr-2" /> Continue with Google
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal />
    </>
  );
};