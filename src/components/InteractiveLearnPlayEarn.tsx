import React from 'react';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Trophy, Play, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { SkeletonLoader } from './SkeletonLoader';
import { useDashboard } from './DashboardContext';

export const InteractiveLearnPlayEarn = () => {
  const { currentLanguage, setLoginModalOpen, setIsLoginMode, isAuthenticated } = useDashboard();
  const [loading, setLoading] = useState(false);

  const handleProtectedAction = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    if (!isAuthenticated) {
      setIsLoginMode(false); // Set to signup mode
      setLoginModalOpen(true);
    } else {
      // Future: Navigate to protected pages
      console.log(`Navigate to ${action} page`);
    }
    }, 1000);
  };

  const content = {
    en: {
      title: 'Learn. Play. Earn.',
      subtitle: 'Boost your financial IQ and earn rewards',
      quizCta: 'Take a quiz now',
      quizTitle: 'Finance Quiz',
      level: 'Level 1',
      question: 'What is compound interest?',
      answers: ['Interest earned on interest', 'Simple interest only', 'Bank fees', 'Inflation rate'],
      panelSubtitle: 'Boost your financial IQ and earn rewards',
      features: ['Interactive financial literacy quizzes', 'Earn rewards for correct answers', 'Redeem rewards and unlock features'],
      badges: [
        { icon: Trophy, label: 'Rewards' },
        { icon: Play, label: 'Play & Learn' },
        { icon: Brain, label: 'Knowledge' }
      ]
    },
    ur: {
      title: 'Learn. Play. Earn.',
      subtitle: 'Financial IQ barhao aur rewards kamao',
      quizCta: 'Abhi quiz lo',
      quizTitle: 'Finance Quiz',
      level: 'Level 1',
      question: 'Compound interest kya hota hai?',
      answers: ['Interest earned on interest', 'Simple interest hi', 'Bank fees', 'Inflation rate'],
      panelSubtitle: 'Financial IQ barhao aur rewards kamao',
      features: ['Interactive financial quizzes', 'Sahi jawab par rewards', 'Rewards redeem karke features unlock'],
      badges: [
        { icon: Trophy, label: 'Rewards' },
        { icon: Play, label: 'Play & Learn' },
        { icon: Brain, label: 'Knowledge' }
      ]
    }
  } as const;

  const t = content[currentLanguage] || content.en;

  if (loading) {
    return <SkeletonLoader type="page" />;
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-purple-50/20 via-white to-orange-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-3 tracking-tight animate-fadeInUp hover-target">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 animate-fadeInUp">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
          {/* Left: Quiz Preview Card */}
          <div className="relative animate-fadeInLeft hover-lift hover-glow hover-target">
            <div className="bg-white rounded-2xl shadow-2xl p-0 border border-gray-200/80 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse-custom">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">{t.quizTitle}</h3>
                </div>
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full">{t.level}</span>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6">
                <p className="text-[#2D2D2D] font-medium mb-4 text-sm sm:text-base">{t.question}</p>
                <div className="space-y-3">
                  <button className="w-full text-left border-2 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-green-50 border-green-500 text-green-800 flex items-center justify-between font-medium hover-target hover-lift text-sm sm:text-base">
                    <span>{t.answers[0]}</span>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </button>
                  <button className="w-full text-left border rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover-target hover-lift transition-all duration-300 text-sm sm:text-base">{t.answers[1]}</button>
                  <button className="w-full text-left border rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover-target hover-lift transition-all duration-300 text-sm sm:text-base">{t.answers[2]}</button>
                  <button className="w-full text-left border rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover-target hover-lift transition-all duration-300 text-sm sm:text-base">{t.answers[3]}</button>
                </div>

                {/* Progress */}
                <div className="mt-4 sm:mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 mb-1">Progress:</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">3/10</p>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[#A786DF] to-[#F59E0B] rounded-full animate-pulse-custom" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="animate-fadeInRight hover-lift hover-target">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200/80">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-white animate-pulse-custom">
                  <Clock3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#2D2D2D]">{t.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{t.panelSubtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {t.badges.map((b, i) => (
                  <div key={i} className="flex flex-col items-center text-center hover-target hover-lift">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-2 shadow-lg animate-pulse-custom">
                      <b.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">{b.label}</p>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#00B8A9] mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleProtectedAction('quiz')}
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover-target hover-lift"
              >
                {t.quizCta} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};