import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useDashboard } from './DashboardContext';

export const Footer: React.FC = () => {
  const { currentLanguage } = useDashboard();

  return (
    <footer className="bg-slate-950/80 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg">NafaVerse</h3>
            <p className="text-slate-300 mt-3 text-sm">Learn, Play, Earn — Islamic finance ko simple aur engaging banaya.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Learn Tracks</li>
              <li>Quizzes & Rewards</li>
              <li>Portfolio</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Newsletter</h4>
            <div className="flex gap-2">
              <input placeholder="Email" className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
              <button className="nv-glow-btn h-11 px-5">Join</button>
            </div>
            <div className="flex gap-4 mt-4 text-slate-300">
              <a aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-sm text-slate-400 flex items-center justify-between">
          <p>© {new Date().getFullYear()} NafaVerse. All rights reserved.</p>
          <p>Made with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
};
