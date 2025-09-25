import React from 'react';
import { useState } from 'react';
import { Sparkles, TrendingUp, Gauge, ShieldCheck, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';
import { SkeletonLoader } from './SkeletonLoader';
import { useDashboard } from './DashboardContext';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const { currentLanguage, isAuthenticated, setLoginModalOpen, setIsLoginMode } = useDashboard();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProtectedAction = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!isAuthenticated) {
        setIsLoginMode(false); // Set to signup mode
        setLoginModalOpen(true);
      } else {
        // Navigate to goal simulation page for authenticated users
        if (action === 'get-started' || action === 'still-thinking') {
          navigate('/goal-simulation');
        }
      }
    }, 1000);
  };

  const content = {
    en: {
      welcome: 'Welcome to NAFAVERSE',
      headline: 'Master Finance with AI-Powered Learning',
      subtitle: "Pakistan's first AI-powered financial literacy platform blending Islamic finance with cutting‑edge tech.",
      primaryCTA: 'Get Started',
      secondaryCTA: 'Still thinking? Start now.',
      tilesTitle: 'Jump into your dashboard',
      tiles: [
        { title: 'Learn Tracks', desc: 'Bite-size lessons', icon: Gauge },
        { title: 'Halal Portfolio', desc: 'Track & grow', icon: TrendingUp },
        { title: 'Safe & Secure', desc: 'Shariah-first', icon: ShieldCheck },
        { title: 'Play & Earn', desc: 'Quizzes, rewards', icon: Gamepad2 },
      ]
    },
    ur: {
      welcome: 'NAFAVERSE mein Khush Aamdeed',
      headline: 'AI ke saath Finance seekhiye aur Master baniye',
      subtitle: 'Pakistan ka pehla AI‑powered financial literacy platform jo Islamic finance ko cutting‑edge technology ke saath milata hai.',
      primaryCTA: 'Shuru Kariye',
      secondaryCTA: 'Abhi bhi soch rahe hain? Abhi shuru kariye',
      tilesTitle: 'Seedha Dashboard par jao',
      tiles: [
        { title: 'Learn Tracks', desc: 'Choti choti lessons', icon: Gauge },
        { title: 'Halal Portfolio', desc: 'Track karo, barhao', icon: TrendingUp },
        { title: 'Secure', desc: 'Shariah‑first safety', icon: ShieldCheck },
        { title: 'Play & Earn', desc: 'Quiz aur rewards', icon: Gamepad2 },
      ]
    }
  } as const;

  const t = content[currentLanguage];

  if (loading) {
    return <SkeletonLoader type="page" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background subtle blobs */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl animate-pulse-custom"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-float"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="text-center">
          <div className="mb-4 sm:mb-6 animate-fadeInUp">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/10 text-purple-100 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse-custom" />
              {t.welcome}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight font-display animate-fadeInUp hover-target">
            {t.headline}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-purple-100 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeInUp px-4">
            {t.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fadeInUp px-4">
            <Button 
              variant="glow" 
              size="lg" 
              className="w-full sm:w-auto hover-lift"
              onClick={() => handleProtectedAction('get-started')}
            >
              <span className="flex items-center">
                {t.primaryCTA}
                <TrendingUp className="w-5 h-5 ml-2" />
              </span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-[rgb(var(--nv-accent))] text-white hover:bg-[rgb(var(--nv-accent))]/10 hover-lift"
              onClick={() => handleProtectedAction('still-thinking')}
            >
              {t.secondaryCTA}
            </Button>
          </div>
        </div>

        {/* Quick dashboard tiles on homepage */}
        <div className="mt-12 sm:mt-16 animate-fadeInUp">
          <h3 className="text-center text-white/90 font-semibold mb-4 sm:mb-6 px-4">
            {t.tilesTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
            {t.tiles.map((tile, idx) => {
              const Icon = tile.icon;
              return (
                <div key={idx} className="nv-card p-4 sm:p-6 nv-neon-border hover-lift hover-glow hover-target">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-[rgb(var(--nv-secondary))]" />
                    <p className="font-semibold text-white text-sm sm:text-base">{tile.title}</p>
                  </div>
                  <p className="text-purple-100/90 text-xs sm:text-sm">{tile.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};