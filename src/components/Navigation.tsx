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
import { NafaVerseLogo } from './NafaVerseLogo';
import { useDashboard } from './DashboardContext';
import { apiService } from '../api/apiService';

interface NavigationProps {
  onScrollToSection: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onScrollToSection }) => {
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
      setTimeout(() => onScrollToSection('hero'), 100);
    } else if (item === 'features') {
      navigate('/');
      setTimeout(() => onScrollToSection('journey'), 100);
    } else if (item === 'about') {
      navigate('/about');
    } else if (item === 'contact') {
      navigate('/contact');
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1E1B4B]/90 via-[#0F0A2E]/90 to-[#312E81]/90 backdrop-blur-md border-b border-[#A786DF]/20 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 hover-target hover-lift">
              <NafaVerseLogo className="h-8 w-8 animate-pulse-custom" />
              <span className="text-lg sm:text-xl font-bold text-white">NafaVerse</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-sm font-medium transition-all duration-300 hover-target hover-lift ${
                  location.pathname === '/' ? 'text-[#A786DF]' : 'text-white hover:text-[#A786DF]'
                }`}
              >
                {t.home}
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="text-white hover:text-[#A786DF] text-sm font-medium transition-all duration-300 hover-target hover-lift"
              >
                {t.features}
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-sm font-medium transition-all duration-300 hover-target hover-lift ${
                  location.pathname === '/about' ? 'text-[#A786DF]' : 'text-white hover:text-[#A786DF]'
                }`}
              >
                {t.about}
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-sm font-medium transition-all duration-300 hover-target hover-lift ${
                  location.pathname === '/contact' ? 'text-[#A786DF]' : 'text-white hover:text-[#A786DF]'
                }`}
              >
                {t.contact}
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={handleLanguageToggle}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-[#A786DF]/20 border border-[#A786DF]/30 hover-target hover-lift text-xs sm:text-sm"
              >
                {t.language}
              </Button>
              <div className="hidden sm:flex items-center space-x-2">
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsLoginMode(true);
                        setLoginModalOpen(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-[#A786DF]/20 hover-target hover-lift"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        setIsLoginMode(false);
                        setLoginModalOpen(true);
                      }}
                      variant="glow"
                      className="text-white hover-target hover-lift"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white/10 text-white hover-target">
                      <User className="w-4 h-4 opacity-80" />
                      <span className="truncate max-w-[80px] sm:max-w-[140px] text-xs sm:text-sm">
                        {user?.username || user?.email || 'User'}
                      </span>
                    </div>
                    <Button onClick={logout} variant="ghost" className="text-white hover:bg-white/10 hover-target hover-lift text-xs sm:text-sm">
                      Logout
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-white hover-target hover-lift">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] border-[rgba(167,134,223,0.3)] p-0">
                  <div className="absolute inset-0 opacity-15">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <SheetHeader className="p-6 border-b border-white/10">
                      <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <NafaVerseLogo className="h-6 w-6" />
                        NafaVerse Menu
                      </SheetTitle>
                      <SheetDescription className="text-purple-200">
                        Navigate through NafaVerse
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-auto p-6 space-y-4">
                      {/* Navigation Links */}
                    <button
                      onClick={() => {
                        handleNavClick('home');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${
                        location.pathname === '/' ? 'bg-[#A786DF]/20 text-[#A786DF] border border-[#A786DF]/30' : 'text-white hover:text-[#A786DF]'
                      }`}
                    >
                      {t.home}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('features');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl text-white hover:text-[#A786DF] hover:bg-white/10 transition-all duration-300"
                    >
                      {t.features}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('about');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${
                        location.pathname === '/about' ? 'bg-[#A786DF]/20 text-[#A786DF] border border-[#A786DF]/30' : 'text-white hover:text-[#A786DF]'
                      }`}
                    >
                      {t.about}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${
                        location.pathname === '/contact' ? 'bg-[#A786DF]/20 text-[#A786DF] border border-[#A786DF]/30' : 'text-white hover:text-[#A786DF]'
                      }`}
                    >
                      {t.contact}
                    </button>
                    </div>
                    {/* Auth Section at Bottom */}
                    <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
                          <User className="w-5 h-5 text-[#A786DF]" />
                          <span className="text-white font-medium truncate">
                            {user?.username || user?.email || 'User'}
                          </span>
                        </div>
                        <Button 
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }} 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                        Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          onClick={() => {
                            setIsLoginMode(true);
                            setLoginModalOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          {t.login}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsLoginMode(false);
                            setLoginModalOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] text-white font-bold"
                        >
                          {t.signup}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            apiService.googleLogin();
                          }}
                          className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-2"
                        >
                          <Chrome className="w-4 h-4" />
                          Continue with Google
                        </Button>
                      </div>
                    )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </nav>
  );
};