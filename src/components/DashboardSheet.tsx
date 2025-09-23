import React from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { LogIn, Settings, TrendingUp, User, Sparkles, LogOut, X } from 'lucide-react';
import { useDashboard } from './DashboardContext';

export const DashboardSheet: React.FC = () => {
  const { dashboardOpen, setDashboardOpen, currentLanguage, setLoginModalOpen, setIsLoginMode, isAuthenticated, user, logout } = useDashboard();

  const t = {
    en: {
      dashboard: 'Dashboard',
      profile: 'Guest User',
      tagline: 'Start your journey',
      balance: 'Coins Balance',
      progress: 'Learning Progress',
      settings: 'Settings',
      login: 'Login / Sign Up',
      tip: 'Complete a quiz to earn coins',
      lessons: 'Lessons',
      achievements: 'Achievements',
      privacy: 'By continuing, you agree to our Terms & Privacy.'
    },
    ur: {
      dashboard: 'Dashboard',
      profile: 'Guest User',
      tagline: 'Apna journey shuru karein',
      balance: 'Coins Balance',
      progress: 'Learning Progress',
      settings: 'Settings',
      login: 'Login / Sign Up',
      tip: 'Quiz complete karke coins kamayein',
      lessons: 'Lessons',
      achievements: 'Achievements',
      privacy: 'Aagay barhne se aap hamari Terms & Privacy se mutafiq hain.'
    }
  } as const;

  const tt = t[currentLanguage];

  // Display name for profile card
  const displayName = (user?.username && user.username.trim()) || user?.email || tt.profile;

  const handleLoginClick = () => {
    setDashboardOpen(false); // Close the dashboard
    setLoginModalOpen(true); // Open the login modal
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      setDashboardOpen(false);
    } else {
      setIsLoginMode(true);
      setLoginModalOpen(true);
    }
  };

  return (
    <Sheet open={dashboardOpen} onOpenChange={setDashboardOpen}>
      <SheetContent side="left" className="w-80 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] border-[rgba(167,134,223,0.3)] p-0 animate-slideInLeft">
         <div className="absolute inset-0 opacity-15">
              <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
        <div className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[rgb(var(--nv-accent))]" /> {tt.dashboard}
            </SheetTitle>
            <SheetDescription className="text-purple-200">
              {tt.tagline}
            </SheetDescription>
            <button
              onClick={() => setDashboardOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </SheetHeader>

          {/* Scrollable content */}
          <div className="flex-1 overflow-auto p-5 space-y-6">
            {/* Guest profile card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[rgb(var(--nv-secondary))] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  {/* was: {tt.profile} */}
                  <h3 className="text-white font-semibold">{displayName}</h3>
                  <p className="text-purple-200 text-sm">{tt.tagline}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-200 text-sm">{tt.balance}</span>
                  <span className="text-[rgb(var(--nv-accent))] font-bold">0 🪙</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2"></div>
                <p className="text-xs text-purple-200 mt-2">{tt.tip}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <p className="text-[rgb(var(--nv-accent))] font-bold">0</p>
                  <p className="text-xs text-purple-200">{tt.lessons}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <p className="text-[rgb(var(--nv-accent))] font-bold">0</p>
                  <p className="text-xs text-purple-200">{tt.achievements}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0">
                <TrendingUp className="w-4 h-4 mr-3" />
                View Portfolio
              </Button>
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0">
                <Settings className="w-4 h-4 mr-3" />
                {tt.settings}
              </Button>
            </div>
          </div>

          {/* Sticky bottom auth */}
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <Button onClick={handleAuthClick} className="w-full h-12 rounded-xl">
              {isAuthenticated ? <><LogOut className="w-4 h-4 mr-2" /> Logout</> : <><LogIn className="w-4 h-4 mr-2" /> Login / Sign Up</>}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
