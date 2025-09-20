import React from 'react';
import { Sparkles, TrendingUp, Gauge, ShieldCheck, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useDashboard } from './DashboardContext';

export const HeroSection = () => {
  const { currentLanguage } = useDashboard();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] relative overflow-hidden">
      {/* Background subtle blobs */}
      <div className="absolute inset-0 opacity-15">
              <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/10 text-purple-100 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              {t.welcome}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display"
          >
            {t.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-purple-100 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            {t.subtitle}
          </motion.p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="glow" size="lg">
              <span className="flex items-center">
                {t.primaryCTA}
                <TrendingUp className="w-5 h-5 ml-2" />
              </span>
            </Button>
            <Button variant="outline" size="lg" className="border-[rgb(var(--nv-accent))] text-white hover:bg-[rgb(var(--nv-accent))]/10">
              {t.secondaryCTA}
            </Button>
          </div>
        </div>

        {/* Quick dashboard tiles on homepage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-center text-white/90 font-semibold mb-6">
            {t.tilesTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.tiles.map((tile, idx) => {
              const Icon = tile.icon;
              return (
                <div key={idx} className="nv-card p-6 nv-neon-border hover:translate-y-[-2px] transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-[rgb(var(--nv-secondary))]" />
                    <p className="font-semibold text-white">{tile.title}</p>
                  </div>
                  <p className="text-purple-100/90 text-sm">{tile.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};