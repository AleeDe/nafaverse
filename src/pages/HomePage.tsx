import { useDashboard } from '../components/DashboardContext';
import { RefObject } from 'react';
import { HeroSection } from '../components/HeroSection';
import { JourneySection } from '../components/JourneySection';
import { InteractiveGraph } from '../components/InteractiveGraph';
import { InteractiveLearnPlayEarn } from '../components/InteractiveLearnPlayEarn';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';
import { DashboardSheet } from '../components/DashboardSheet';
import { User } from 'lucide-react'; // User icon import karein

interface HomePageProps {
  refs: {
    heroRef: RefObject<HTMLDivElement>;
    journeyRef: RefObject<HTMLDivElement>;
    graphRef: RefObject<HTMLDivElement>;
    learnRef: RefObject<HTMLDivElement>;
    ctaRef: RefObject<HTMLDivElement>;
  };
}

export function HomePage({ refs }: HomePageProps) {
  const { dashboardOpen, setDashboardOpen, currentLanguage } = useDashboard();

  return (
    <>
      {/* Dashboard Toggle Icon - Top Left */}
      {!dashboardOpen && (
        <div className="fixed top-[80px] left-[30px] z-[1100]">
          <button
            onClick={() => setDashboardOpen(true)}
            className="bg-gradient-to-br from-purple-400 to-blue-500 text-white w-12 h-11 flex items-center justify-center rounded-xl shadow-lg hover:shadow-blue-500/30 transition-shadow"
            aria-label="Open Dashboard"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      )}
      <DashboardSheet />
      <div ref={refs.heroRef}><HeroSection /></div>
      <div className="bg-white">
        <div ref={refs.journeyRef}><JourneySection /></div>
        <div ref={refs.graphRef}><InteractiveGraph /></div>
        <div ref={refs.learnRef}><InteractiveLearnPlayEarn /></div>
        <div ref={refs.ctaRef}><FinalCTA /></div>
        <Footer />
      </div>
    </>
  );
}
