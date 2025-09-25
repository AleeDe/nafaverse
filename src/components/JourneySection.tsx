import React from 'react';
import { useState } from 'react';
import { Brain, Target, TrendingUp } from 'lucide-react';
import { useDashboard } from './DashboardContext';
import { SkeletonLoader } from './SkeletonLoader';
import { Button } from './ui/button'; // Assuming you have this from shadcn/ui
import { useNavigate } from 'react-router-dom';

export const JourneySection = () => {
  const { currentLanguage, setLoginModalOpen, setIsLoginMode, isAuthenticated } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
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

  const handleStepClick = (stepIndex: number, stepType: string) => {
    setLoadingStep(stepIndex);
    setTimeout(() => {
      setLoadingStep(null);
      if (!isAuthenticated) {
        setIsLoginMode(false); // Set to signup mode
        setLoginModalOpen(true);
      } else {
        // Navigate to goal simulation page for all steps
        navigate('/goal-simulation');
      }
    }, 1000);
  };
  const content = {
    en: {
      journeyTitle: 'Your Journey to Financial Freedom',
      journeySubtitle: 'Three simple steps to transform your financial future',
      understand: 'Understand',
      understandDesc: 'Learn investment fundamentals through interactive content.',
      simulate: 'Simulate',
      simulateDesc: 'Practice with virtual portfolios & see real-time market scenarios.',
      grow: 'Grow',
      growDesc: 'Execute with confidence & track your progress.',
      readyToStart: 'Ready to start? Join today →'
    },
    ur: {
      journeyTitle: 'Aap ka safar financial azaadi ki taraf',
      journeySubtitle: 'Sirf 3 asaan qadam jo future badal dein',
      understand: 'Samjho',
      understandDesc: 'Interactive content se investment ki bunyaadi baatein seekho.',
      simulate: 'Simulate karo',
      simulateDesc: 'Virtual portfolio par practice karo aur real-time market scenarios dekho.',
      grow: 'Grow karo',
      growDesc: 'Itiqaad ke saath execute karo aur apni progress track karo.',
      readyToStart: 'Start karne ko tayar? Aaj hi join karo →'
    }
  } as const;

  const t = content[currentLanguage] || content.en;

  if (loading) {
    return <SkeletonLoader type="page" />;
  }

  const steps = [
    {
      icon: Brain,
      title: t.understand,
      description: t.understandDesc,
      color: 'from-[#1E1B4B] to-[#8B5CF6]',
      type: 'understand'
    },
    {
      icon: Target,
      title: t.simulate,
      description: t.simulateDesc,
      color: 'from-[#8B5CF6] to-[#F59E0B]',
      type: 'simulate'
    },
    {
      icon: TrendingUp,
      title: t.grow,
      description: t.growDesc,
      color: 'from-[#F59E0B] to-[#1E1B4B]',
      type: 'grow'
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-[#8B5CF6]/10 via-white to-[#F59E0B]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 font-bold text-[#1E293B] animate-fadeInUp hover-target">
            {t.journeyTitle}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp">
            {t.journeySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {steps.map((step, index) => (
            <div key={index} className="group h-full animate-fadeInUp hover-lift hover-glow hover-target" style={{ animationDelay: `${index * 0.2}s` }}>
              <div 
                className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105"
                onClick={() => handleStepClick(index, step.type)}
                style={{ opacity: loadingStep === index ? 0.6 : 1 }}
              >
                <div className="p-0">
                  {/* Header with Icon */}
                  <div className={`bg-gradient-to-br ${step.color} p-4 sm:p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-2 right-2 opacity-10 animate-float">
                      <step.icon className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 ${loadingStep === index ? 'animate-spin' : 'animate-pulse-custom'}`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold">{step.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 text-center">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-fadeInUp">
          <Button
            onClick={() => handleProtectedAction('ready-to-start')}
            size="lg"
            className="bg-[#1E1B4B] hover:bg-[#1E1B4B]/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover-target hover-lift w-full sm:w-auto"
          >
            {t.readyToStart}
          </Button>
        </div>
      </div>
    </section>
  );
};