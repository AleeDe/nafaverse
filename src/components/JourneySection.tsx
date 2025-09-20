import React from 'react';
import { Brain, Target, TrendingUp } from 'lucide-react';
import { useDashboard } from './DashboardContext';
import { motion } from 'framer-motion';
import { Button } from './ui/button'; // Assuming you have this from shadcn/ui

export const JourneySection = () => {
  const { currentLanguage, setLoginModalOpen } = useDashboard();

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

  const steps = [
    {
      icon: Brain,
      title: t.understand,
      description: t.understandDesc,
      color: 'from-[#1E1B4B] to-[#8B5CF6]'
    },
    {
      icon: Target,
      title: t.simulate,
      description: t.simulateDesc,
      color: 'from-[#8B5CF6] to-[#F59E0B]'
    },
    {
      icon: TrendingUp,
      title: t.grow,
      description: t.growDesc,
      color: 'from-[#F59E0B] to-[#1E1B4B]'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#8B5CF6]/10 via-white to-[#F59E0B]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl mb-4 font-bold text-[#1E293B]"
          >
            {t.journeyTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t.journeySubtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group h-full"
            >
              <div className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
                <div className="p-0">
                  {/* Header with Icon */}
                  <div className={`bg-gradient-to-br ${step.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-2 right-2 opacity-10">
                      <step.icon className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => setLoginModalOpen(true)}
            size="lg"
            className="bg-[#1E1B4B] hover:bg-[#1E1B4B]/90 text-white px-8 py-4 rounded-lg"
          >
            {t.readyToStart}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};