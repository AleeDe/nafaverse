import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useDashboard } from '../components/DashboardContext';

export function ComingSoonPage() {
  const { currentLanguage } = useDashboard();
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const content = {
    en: {
      comingSoon: 'Coming Soon...',
      subtitle: 'We are working hard to bring you this amazing feature!',
      backHome: 'Back to Home'
    },
    ur: {
      comingSoon: 'Coming Soon...',
      subtitle: 'Hum is amazing feature par kaam kar rahe hain!',
      backHome: 'Ghar Wapas'
    }
  } as const;

  const t = content[currentLanguage];
  const fullText = t.comingSoon;

  useEffect(() => {
    // Reset animation when component mounts
    setDisplayText('');
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80); // Slightly faster typing
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] relative overflow-hidden flex items-center justify-center">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl animate-pulse-custom"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-float"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Sparkles className="w-16 h-16 text-[#8B5CF6] mx-auto animate-pulse-custom mb-6" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-display">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        <Button
          onClick={() => navigate('/')}
          size="lg"
          className="bg-gradient-to-r from-[#A786DF] to-[#60A5FA] hover:from-[#A786DF]/90 hover:to-[#60A5FA]/90 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t.backHome}
        </Button>
      </div>
    </div>
  );
}