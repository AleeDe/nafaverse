import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { NafaVerseLogo } from "./NafaVerseLogo";
import { useDashboard } from "./DashboardContext";

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
      home: "Home",
      features: "Features",
      about: "About",
      contact: "Contact",
      moneyTracking: "Money Tracking",
      growAndLearn: "Grow & Learn",
      login: "Login",
      signup: "Sign Up",
      language: "اردو",
    },
    ur: {
      home: "Ghar",
      features: "Khasoosiyat",
      about: "Humare Bare Mein",
      contact: "Raabta",
      moneyTracking: "Paisa Tracking",
      growAndLearn: "Seekho Aur Barhao",
      login: "Login",
      signup: "Sign Up",
      language: "English",
    },
  } as const;

  const t = content[currentLanguage] || content.en;

  const handleNavClick = (item: string) => {
    if (item === "home") {
      navigate("/");
      setTimeout(() => onScrollToSection("hero"), 100);
    } else if (item === "features") {
      navigate("/");
      setTimeout(() => onScrollToSection("journey"), 100);
    } else if (item === "about") {
      navigate("/about");
    } else if (item === "contact") {
      navigate("/contact");
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === "en" ? "ur" : "en");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1E1B4B]/90 via-[#0F0A2E]/90 to-[#312E81]/90 backdrop-blur-md border-b border-[#A786DF]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <NafaVerseLogo className="h-6 w-6 sm:h-8 sm:w-8 animate-pulse-custom" />
            <span className="text-lg sm:text-xl font-bold text-white">
              NafaVerse
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => handleNavClick("home")}
              className={`text-sm font-medium transition-all ${
                location.pathname === "/"
                  ? "text-[#A786DF]"
                  : "text-white hover:text-[#A786DF]"
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavClick("features")}
              className="text-sm font-medium text-white hover:text-[#A786DF] transition-all"
            >
              {t.features}
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className={`text-sm font-medium transition-all ${
                location.pathname === "/about"
                  ? "text-[#A786DF]"
                  : "text-white hover:text-[#A786DF]"
              }`}
            >
              {t.about}
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={`text-sm font-medium transition-all ${
                location.pathname === "/contact"
                  ? "text-[#A786DF]"
                  : "text-white hover:text-[#A786DF]"
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
              className="text-white border border-[#A786DF]/30 hover:bg-[#A786DF]/20 text-xs sm:text-sm"
            >
              {t.language}
            </Button>

            {/* Desktop Auth */}
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
                    className="text-white hover:bg-[#A786DF]/20"
                  >
                    {t.login}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsLoginMode(false);
                      setLoginModalOpen(true);
                    }}
                    variant="glow"
                    className="text-white"
                  >
                    {t.signup}
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white/10 text-white">
                    <User className="w-4 h-4 opacity-80" />
                    <span className="truncate max-w-[120px]">
                      {user?.username || user?.email || "User"}
                    </span>
                  </div>
                  <Button
                    onClick={logout}
                    variant="ghost"
                    className="text-white hover:bg-white/10 text-xs sm:text-sm"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-[#1E1B4B]/95 via-[#0F0A2E]/95 to-[#312E81]/95 backdrop-blur-md border-t border-[#A786DF]/20">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <button
              onClick={() => {
                handleNavClick("home");
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/"
                  ? "bg-[#A786DF]/20 text-[#A786DF]"
                  : "text-white hover:bg-white/10 hover:text-[#A786DF]"
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => {
                handleNavClick("features");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 hover:text-[#A786DF]"
            >
              {t.features}
            </button>
            <button
              onClick={() => {
                handleNavClick("about");
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/about"
                  ? "bg-[#A786DF]/20 text-[#A786DF]"
                  : "text-white hover:bg-white/10 hover:text-[#A786DF]"
              }`}
            >
              {t.about}
            </button>
            <button
              onClick={() => {
                handleNavClick("contact");
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/contact"
                  ? "bg-[#A786DF]/20 text-[#A786DF]"
                  : "text-white hover:bg-white/10 hover:text-[#A786DF]"
              }`}
            >
              {t.contact}
            </button>
            <button
              onClick={() => {
                handleNavClick("moneyTracking");
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/money-tracking"
                  ? "bg-[#A786DF]/20 text-[#A786DF]"
                  : "text-white hover:bg-white/10 hover:text-[#A786DF]"
              }`}
            >
              {t.moneyTracking}
            </button>
            <button
              onClick={() => {
                handleNavClick("growAndLearn");
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/grow-and-learn"
                  ? "bg-[#A786DF]/20 text-[#A786DF]"
                  : "text-white hover:bg-white/10 hover:text-[#A786DF]"
              }`}
            >
              {t.growAndLearn}
            </button>
          </div>

          <div className="px-4 py-4 border-t border-white/10 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#A786DF]" />
                  <span className="text-white font-medium truncate">
                    {user?.username || user?.email || "User"}
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
              </>
            ) : (
              <>
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
                  variant="glow"
                  className="w-full text-white"
                >
                  {t.signup}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
