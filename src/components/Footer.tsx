import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useDashboard } from './DashboardContext';

export const Footer: React.FC = () => {
  const { currentLanguage } = useDashboard();

  return (
    <footer className="bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] border-t border-white/10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-3">NafaVerse</h3>
            <p className="text-purple-100/90 mt-3 text-xs sm:text-sm leading-relaxed">Learn, Play, Earn — Islamic finance ko simple aur engaging banaya.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
            <ul className="space-y-2 sm:space-y-3 text-purple-100/80 text-xs sm:text-sm">
              <li className="hover:text-[#A786DF] transition-colors cursor-pointer">Learn Tracks</li>
              <li className="hover:text-[#A786DF] transition-colors cursor-pointer">Quizzes & Rewards</li>
              <li className="hover:text-[#A786DF] transition-colors cursor-pointer">Portfolio</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-3 text-purple-100/80 text-xs sm:text-sm">
              <li className="hover:text-[#A786DF] transition-colors cursor-pointer">About</li>
              <li className="hover:text-[#A786DF] transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                placeholder="Email" 
                className="flex-1 h-10 sm:h-11 rounded-xl bg-white/10 border border-white/20 px-3 sm:px-4 text-white placeholder:text-purple-200/60 focus:outline-none focus:ring-2 focus:ring-[#A786DF]/50 focus:border-[#A786DF]/50 transition-all text-sm" 
              />
              <button className="nv-glow-btn h-10 sm:h-11 px-4 sm:px-5 font-medium text-sm">Join</button>
            </div>
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 text-purple-100/70 justify-center sm:justify-start">
              <a aria-label="Twitter" className="hover:text-[#A786DF] transition-colors cursor-pointer transform hover:scale-110">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a aria-label="Facebook" className="hover:text-[#A786DF] transition-colors cursor-pointer transform hover:scale-110">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a aria-label="Instagram" className="hover:text-[#A786DF] transition-colors cursor-pointer transform hover:scale-110">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a aria-label="LinkedIn" className="hover:text-[#A786DF] transition-colors cursor-pointer transform hover:scale-110">
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-white/20 text-xs sm:text-sm text-purple-100/60 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 relative z-10">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} NafaVerse. All rights reserved.</p>
          <p className="flex items-center gap-1 text-center sm:text-right">
            Made with <span className="text-red-400 animate-pulse">❤️</span> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};
