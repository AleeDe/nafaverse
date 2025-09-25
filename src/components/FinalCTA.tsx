import React from 'react';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useDashboard } from './DashboardContext';
import { SkeletonLoader } from './SkeletonLoader';
import { Button } from './ui/button'; // Assuming you have a Button component
import { useNavigate } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  const { currentLanguage, setLoginModalOpen, setIsLoginMode, isAuthenticated } = useDashboard();
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
        navigate('/goal-simulation');
      }
    }, 1000);
  };

  const content = {
    en: {
      title: 'READY. SET. INVEST.',
      subtitle: 'Join NafaVerse today and start your journey to financial independence with Islamic principles and AI guidance.',
      primaryCTA: 'Start Free Trial',
      secondaryCTA: 'Join Community'
    },
    ur: {
      title: 'Ready • Set • Invest',
      subtitle: 'Aaj hi NafaVerse join karein aur Islamic principles + AI guidance ke saath financial azaadi ka safar shuru karein.',
      primaryCTA: 'Free Trial shuru karein',
      secondaryCTA: 'Community join karein'
    }
  } as const;

  const t = content[currentLanguage] || content.en;

  if (loading) {
    return <SkeletonLoader type="page" />;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] relative overflow-hidden px-2 sm:px-0 overflow-x-hidden">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Sparkles className="w-16 h-16 text-[#8B5CF6] mx-auto animate-pulse" />
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {t.title}
        </h2>
        <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-3xl mx-auto">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
          <Button
            onClick={() => handleProtectedAction('start-free-trial')}
            size="lg"
            className="bg-indigo-600 text-white font-bold rounded-xl px-8 py-4 text-lg w-full sm:w-auto transition-all duration-300 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
          >
            {t.primaryCTA}
          </Button>
          <Button
            onClick={() => handleProtectedAction('join-community')}
            size="lg"
            variant="outline"
            className="bg-transparent border-white/30 text-white font-bold rounded-xl px-8 py-4 text-lg w-full sm:w-auto transition-all duration-300 hover:bg-white/10 hover:border-white/50"
          >
            {t.secondaryCTA}
          </Button>
        </div>
      </div>
    </section>
  );
};