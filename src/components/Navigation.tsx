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
                <SheetContent side="right" className="p-0 border-none w-full max-w-xs animate-slideInRight">
                  {/* Gradient/Blob Background */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81]">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl opacity-20 animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl opacity-20 animate-pulse-custom"></div>
                  </div>
                  <SheetHeader>
                    <SheetTitle className="text-white">Menu</SheetTitle>
                    <SheetDescription className="text-slate-300">
                      Navigate through NafaVerse
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-8 px-4">
                    <button
                      onClick={() => {
                        handleNavClick('home');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#A786DF] text-left py-2 hover-target hover-lift transition-all duration-300"
                    >
                      {t.home}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('features');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#A786DF] text-left py-2 hover-target hover-lift transition-all duration-300"
                    >
                      {t.features}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('about');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#A786DF] text-left py-2 hover-target hover-lift transition-all duration-300"
                    >
                      {t.about}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#A786DF] text-left py-2 hover-target hover-lift transition-all duration-300"
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
                      className="mt-6 w-full bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] text-white font-bold text-lg py-3 rounded-xl shadow-lg hover-target hover-lift"
                    >
                      Get Started
                    </Button>
                  </div>
                  {/* Login/Signup at Bottom */}
                  <div className="absolute bottom-0 left-0 w-full flex flex-col gap-2 px-4 pb-6 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    {isAuthenticated ? (
                      <Button onClick={logout} className="w-full mt-6 bg-red-600 text-white hover-target hover-lift">
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
                          className="w-full text-white border border-white/20 hover-target hover-lift"
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
                          className="w-full text-white hover-target hover-lift"
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
                          className="w-full text-white border border-white/20 hover-target hover-lift"
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
  );
};