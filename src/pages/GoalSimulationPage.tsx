import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, Target, Calculator, Plus, Minus, MapPin, GraduationCap, Home, Building2, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../components/ui/button';
import { useDashboard } from '../components/DashboardContext';
import { DashboardSheet } from '../components/DashboardSheet';
import { apiService } from '../api/apiService'; // add

// Types for API normalization
type GraphPoint = { year: number; projectedValue: number };
type ApiGoalResult = {
  goalId?: any;
  originalPrompt?: string; // will not display in UI
  goalName?: string;
  city?: string;
  estimatedCost?: number;
  totalInvestment?: number;
  targetYear?: number;
  monthlySavingRequired?: number;
  roiRate?: number;
  inflationRate?: number;
  finalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  graphData?: GraphPoint[];
};

type ApiSimulationResult = {
  id?: any;
  userId?: any;
  originalPrompt?: string; // will not display in UI
  city?: string;
  oneTimeInvestment?: number;
  monthlyInvestment?: number;
  duration?: number[] | number;
  inflationRate?: number[] | number;
  roiRate?: number;
  totalInvestment?: number;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  graphData?: GraphPoint[];
  finalAmount?: number;
};

type UnifiedResult = {
  monthlyInvestment: number;
  finalAmount: number;
  totalInvestment?: number;
  chartData: Array<{ year: number | string; amount: number }>;
  from: 'planner' | 'simulation';
  meta?: {
    city?: string;
    goalName?: string;
    targetYear?: number;
    durationYears?: number;
    roiRate?: number;
    inflationRate?: number;
  };
  planSummary?: any;
};

// Typewriter hook with cleanup
function useTypewriter(
  phrases: string[],
  opts?: { typeSpeed?: number; pause?: number; backspace?: boolean; backSpeed?: number }
) {
  const { typeSpeed = 70, pause = 1500, backspace = false, backSpeed = 35 } = opts || {};
  const [text, setText] = useState('');
  useEffect(() => {
    let i = 0;           // phrase index
    let pos = 0;         // char position
    let deleting = false;
    let timer: number;

    const tick = () => {
      const current = phrases[i % phrases.length] || '';
      if (!deleting) {
        if (pos <= current.length) {
          setText(current.slice(0, pos));
          pos += 1;
          timer = window.setTimeout(tick, typeSpeed);
        } else {
          if (backspace) {
            deleting = true;
            timer = window.setTimeout(tick, pause);
          } else {
            // jump to next phrase after pause
            timer = window.setTimeout(() => {
              pos = 0;
              i = (i + 1) % phrases.length;
              tick();
            }, pause);
          }
        }
      } else {
        if (pos >= 0) {
          setText(current.slice(0, pos));
          pos -= 1;
          timer = window.setTimeout(tick, backSpeed);
        } else {
          deleting = false;
          i = (i + 1) % phrases.length;
          timer = window.setTimeout(tick, 300);
        }
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, [phrases, typeSpeed, pause, backspace, backSpeed]);

  return text;
}

export const GoalSimulationPage: React.FC = () => {
  const { currentLanguage, dashboardOpen, setDashboardOpen } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [goalSearchQuery, setGoalSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);

  // Simulation Inputs — extended to match API
  const [simulationInputs, setSimulationInputs] = useState({
    roi: 12,                // roiRate
    time: 5,                // durationYears
    initialAmount: 100000,  // oneTimeInvestment
    monthlyInvestment: 20000,
    inflationRate: 6,
    city: 'Karachi'
  });
  const [simulationResult, setSimulationResult] = useState<UnifiedResult | null>(null);

  // Animation states for result section
  const [resultAnimate, setResultAnimate] = useState(false);
  const [resultGlow, setResultGlow] = useState(false);

  // NEW: Target Year for planner
  const currentYear = new Date().getFullYear();
  const minTargetYear = Math.max(2026, currentYear);
  const yearOptions = useMemo(() => Array.from({ length: 20 }, (_, i) => minTargetYear + i), [minTargetYear]);

  const [plannerOpen, setPlannerOpen] = useState(false);
  const [selectedGoalName, setSelectedGoalName] = useState<string | null>(null);
  const [plannerCity, setPlannerCity] = useState('');
  const [plannerYear, setPlannerYear] = useState<number>(minTargetYear);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState<string | null>(null);
  const [plannerSubType, setPlannerSubType] = useState<'Umrah' | 'Hajj' | ''>('');
  const isPilgrimage = useMemo(() => {
    const n = (selectedGoalName || '').toLowerCase();
    return n.includes('umrah') || n.includes('hajj');
  }, [selectedGoalName]);

  // NEW: detect Study Abroad goal
  const isStudyAbroad = useMemo(() => {
    const n = (selectedGoalName || '').toLowerCase();
    return n.includes('study abroad') || (n.includes('study') && n.includes('abroad'));
  }, [selectedGoalName]);

  // AI Loader + Toasts
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('Talking to our AI planner…');
  type ToastItem = { id: number; title: string; description?: string; variant?: 'success' | 'error' | 'info' };
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const pushToast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  const openPlanner = (goalName: string) => {
    setSelectedGoalName(goalName);
    setPlannerCity('');
    setPlannerYear(minTargetYear);
    setPlannerSubType(
      goalName.toLowerCase().includes('umrah') || goalName.toLowerCase().includes('hajj')
        ? 'Umrah'
        : ''
    );
    setPlannerOpen(true);
  };

  // Small helpers
  const GOAL_FIXED_PROMPT =
    'Use PKR as currency. Round amounts to the nearest thousand. Prefer conservative estimates.';
  const SIM_FIXED_PROMPT =
    'Use PKR. Start from the current year. Output strictly valid JSON.';

  // Append pilgrimage cost guidance when the context mentions Hajj or Umrah
  const buildPrompt = (base: string, context?: string) => {
    const ctx = (context || '').toLowerCase();
    const additions: string[] = [];
    // Only add these definitive cost notes when the context explicitly references them
    if (ctx.includes('hajj') || ctx.includes('haj')) {
      additions.push('Note: use PKR 1,200,000 as the current typical cost estimate for Hajj (adjust only for clear regional differences).');
    }
    if (ctx.includes('umrah') || ctx.includes('umrah')) {
      additions.push('Note: use PKR 400,000 as the current typical cost estimate for Umrah (adjust only for clear regional differences).');
    }
    if (additions.length === 0) return base;
    return `${base} ${additions.join(' ')}`;
  };

  // Normalize API responses to one shape the UI understands
  const unifyFromGoalApi = (data: ApiGoalResult): UnifiedResult => {
    console.log(data);
    
    const monthlyInvestment = Math.round(data.monthlySavingRequired ?? 0);
    
    const finalAmount =
      Math.round(
        data.finalAmount ??
        data.estimatedCost ??
        (data.graphData?.[data.graphData.length - 1]?.projectedValue ?? 0)
      );

    const chartData =
      (data.graphData || []).map((p) => ({ year: p.year, amount: Math.round(p.projectedValue) }));

    return {
      monthlyInvestment,
      finalAmount,

      totalInvestment: Math.round(data.totalInvestment ?? 0), // not always provided by goal API
      chartData,
      from: 'planner',
      meta: {
        city: data.city,
        goalName: data.goalName,
        targetYear: data.targetYear,
        roiRate: data.roiRate,
        inflationRate: data.inflationRate
      },
      planSummary: undefined
    };
  };

  const unifyFromSimulationApi = (data: ApiSimulationResult, inputMonthly: number): UnifiedResult => {
    const monthlyFromApi = data?.monthlyInvestment ?? (data as any)?.monthlySavingRequired;
    const monthlyInvestment = Math.round(monthlyFromApi ?? inputMonthly ?? 0);

    const finalAmount = Math.round(
      data.finalAmount ??
      data.totalAmount ??
      (data.graphData?.[data.graphData.length - 1]?.projectedValue ?? 0)
    );

    const chartData =
      (data.graphData || []).map((p) => ({ year: p.year, amount: Math.round(p.projectedValue) }));

    return {
      monthlyInvestment,
      finalAmount,
      totalInvestment: data.totalInvestment,
      chartData,
      from: 'simulation',
      meta: {
        city: data.city,
        durationYears: Array.isArray(data.duration) ? data.duration[0] : (data.duration as number),
        roiRate: data.roiRate,
        inflationRate: Array.isArray(data.inflationRate) ? data.inflationRate[0] : (data.inflationRate as number)
      },
      planSummary: undefined
    };
  };

  const handlePlannerSubmit = async () => {
    if (!selectedGoalName) return;

    const token = localStorage.getItem('token');
    if (!token) {
      pushToast({ variant: 'error', title: 'Login required', description: 'Please sign in first.' });
      return;
    }

    setPlannerLoading(true);
    setPlannerError(null);
    setAiMessage('Crafting your goal plan with AI… Thanks for your patience!');
    setAiLoading(true);

    try {
      // Build goalName as requested (Umrah/Hajj are explicit)
      const computedGoalName = (() => {
        const base = (selectedGoalName || '').toLowerCase();
        if (base.includes('umrah') || base.includes('hajj')) {
          const pick = plannerSubType || 'Umrah';
          return `Perform ${pick}`;
        }
        return selectedGoalName || '';
      })();

      // ONLY these fields go to backend
      const payload = {
        goalName: computedGoalName,
        city: plannerCity,
        targetYear: plannerYear,
        prompt: buildPrompt(GOAL_FIXED_PROMPT, computedGoalName),
      };

      // Sync duration with target year (UI only)
      const yearsUntil = Math.max(1, plannerYear - currentYear);
      setSimulationInputs(prev => ({ ...prev, time: yearsUntil }));

  // Call real API (no dummy fallback)
  let data: ApiGoalResult;
  try {
    data = await apiService.createGoalPlan(payload);
    console.log("Received goal plan data:", data);
  } catch (err: any) {
    if (err?.response?.status === 401) {
      pushToast({ variant: 'error', title: 'Session expired', description: 'Please log in again.' });
    } else if (err?.response?.status === 429) {
      pushToast({ variant: 'error', title: 'AI quota exceeded', description: 'Please try again later.' });
    } else {
      pushToast({ variant: 'error', title: 'Failed to generate goal plan', description: 'Please try again later.' });
    }
    setPlannerOpen(false);
    return;
  }

  const unified = unifyFromGoalApi(data);
  setSimulationResult(unified);
  pushToast({
        variant: 'success',
        title: 'Goal plan ready',
        description: `${unified.meta?.goalName || 'Goal'} • ${unified.meta?.city || ''}`
      });
      setPlannerOpen(false);
      scrollToSection(resultRef);
    } catch (e: any) {
      setPlannerError(e?.message || 'Something went wrong.');
      pushToast({ variant: 'error', title: 'Failed to generate goal plan' });
    } finally {
      setPlannerLoading(false);
      setAiLoading(false);
    }
  };

  // Refs for scrolling
  const goalsRef = useRef<HTMLDivElement>(null);
  const simulateRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const content = {
    en: {
      heroTitle: 'Turn Your Dreams Into Achievable Financial Goals',
      searchPlaceholder: 'Search for your financial goal...',
      goalBtn: 'Goals',
      simulateBtn: 'Simulate',
      goalsTitle: 'Goals for You',
      goalSearchPlaceholder: 'Type to find more goals...',
      simulateTitle: 'Simulate Your Plan',
      resultTitle: 'Your Simulation Result',
      calculateBtn: 'Run AI Simulation',
      startPlanning: 'Start Planning',
      roi: 'ROI (%)',
      time: 'Time (years)',
      initialAmount: 'One-time Investment (PKR)',
      targetAmount: 'Target Amount (PKR)',
      city: 'City',
      monthlyInvestment: 'Monthly Investment (PKR)',
      inflation: 'Inflation (%)',
      goals: [
        { 
          name: 'Umrah / Hajj', 
          desc: 'Plan your spiritual journey with our Islamic-compliant savings and investment options designed for pilgrimage goals.',
          image: '/images/kaaba image final.jpg',
          icon: MapPin
        },
        { 
          name: 'House', 
          desc: 'Build wealth for major purchases with smart investment strategies and down payment planning.',
          image: '/images/home image.jpg',
          icon: Home
        },
        { 
          name: 'Study Abroad', 
          // updated description: include a visual break and explicit instruction to fill the destination city
          desc: 'Achieve your international education goals with structured savings plans and scholarship guidance.\n\nPlease enter the city where you want to study (e.g., London, Toronto) so we can tailor cost estimates and living expenses.',
          image: '/images/univeristy image.jpg',
          icon: GraduationCap
        },
        { 
          name: 'Small Business', 
          desc: 'Fund your entrepreneurial vision with business-focused financial planning and growth strategies.',
          image: '/images/startup.jpg',
          icon: Building2
        }
      ],
      suggestions: ['Marriage', 'Retirement', 'Car Purchase', 'Emergency Fund', 'Child Education', 'Vacation', 'Medical Emergency', 'Property Investment'],
      placeholders: ['Search for Marriage goals...', 'Find Retirement plans...', 'Look for Car financing...', 'Emergency fund planning...', 'Education savings...']
    },
    ur: {
      heroTitle: 'Apne Khwabon Ko Financial Goals Mein Tabdeel Karein',
      searchPlaceholder: 'Apna financial goal search karein...',
      goalBtn: 'Goals',
      simulateBtn: 'Simulate',
      goalsTitle: 'Aap Ke Liye Goals',
      goalSearchPlaceholder: 'Mazeed goals ke liye type karein...',
      simulateTitle: 'Apna Plan Simulate Karein',
      resultTitle: 'Aap Ka Simulation Result',
      calculateBtn: 'AI Simulation Chalayein',
      startPlanning: 'Planning Shuru Karein',
      roi: 'ROI (%)',
      time: 'Waqt (saal)',
      initialAmount: 'Ek Martaba Investment (PKR)',
      targetAmount: 'Target Raqam (PKR)',
      city: 'Shehar',
      monthlyInvestment: 'Mahwari Investment (PKR)',
      inflation: 'Mehangai (%)',
      goals: [
        { 
          name: 'Umrah / Hajj', 
          desc: 'Islamic-compliant savings aur investment options ke saath apna spiritual journey plan karein.',
          image: '/images/kaaba image final.jpg',
          icon: MapPin
        },
        { 
          name: 'House', 
          desc: 'Smart investment strategies aur down payment planning ke saath wealth build karein.',
          image: '/images/home image.jpg',
          icon: Home
        },
        { 
          name: 'Study Abroad', 
          // updated Urdu description: ask for destination city
          desc: 'International taleem ke goals hasil karne ke liye structured savings aur scholarship guidance. Barah-e-karam woh shehar darj karein jahan aap parhai karna chahte hain (misal: London, Toronto) taake hum andazan kharch aur rehna sahulat ke mutabiq estimate de saken.',
          image: '/images/univeristy image.jpg',
          icon: GraduationCap
        },
        { 
          name: 'Small Business', 
          desc: 'Business-focused financial planning aur growth strategies ke saath entrepreneurial vision fund karein.',
          image: '/images/startup.jpg',
          icon: Building2
        }
      ],
      suggestions: ['Shadi', 'Retirement', 'Gari', 'Emergency Fund', 'Bachon Ki Taleem', 'Vacation', 'Medical Emergency', 'Property Investment'],
      placeholders: ['Shadi ke goals search karein...', 'Retirement plans dhundein...', 'Gari financing dekhein...', 'Emergency fund planning...', 'Taleem ki savings...']
    }
  };

  const t = content[currentLanguage];

  // NEW: placeholders
  const simCityPlaceholder =
    currentLanguage === 'ur'
      ? 'Apna shehar likhein (misal: Karachi)'
      : 'Enter your city (e.g., Karachi)';

  const plannerCityPlaceholder = isStudyAbroad
    ? (currentLanguage === 'ur'
        ? 'Jis shehar mein parhai karna chahte hain, woh likhein (misal: London, Toronto)'
        : 'Enter the city where you want to study (e.g., London, Toronto)')
    : simCityPlaceholder;

  // Stable phrases list per language
  const heroPhrases = useMemo(() => t.placeholders.slice(), [currentLanguage]);
  const typedMain = useTypewriter(heroPhrases, { typeSpeed: 70, pause: 1600, backspace: false });

  const handleInputChange = (field: string, value: number | string) => {
    setSimulationInputs(prev => ({ ...prev, [field]: value as any }));
  };

  // New: Simulation via API (with dummy fallback)
  const runSimulation = async () => {
    const { roi, time, initialAmount, monthlyInvestment, inflationRate, city } = simulationInputs;
    // ONLY these fields go to backend
    const payload = {
      city,
      durationYears: time,
      oneTimeInvestment: initialAmount,
      monthlyInvestment,
      roiRate: roi,
      inflationRate,
      // include pilgrimage costs only when the context mentions Hajj/Umrah
      prompt: buildPrompt(SIM_FIXED_PROMPT, `${simulationInputs.city} ${goalSearchQuery} ${searchQuery}`),
    };

    const token = localStorage.getItem('token');
    if (!token) {
      pushToast({ variant: 'error', title: 'Login required', description: 'Please sign in first.' });
      return;
    }

    setAiMessage('Running your AI simulation… This may take a few seconds.');
    setAiLoading(true);

    try {
      // Call real API (no dummy fallback)
      let data: ApiSimulationResult;
      try {
        data = await apiService.createSimulationPlan(payload);
        console.log("simulation response:", data);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          pushToast({ variant: 'error', title: 'Session expired', description: 'Please log in again.' });
        } else {
          pushToast({ variant: 'error', title: 'Simulation failed', description: 'Please try again later.' });
        }
        return;
      }

      const unified = unifyFromSimulationApi(data, monthlyInvestment);
      setSimulationResult(unified);
      pushToast({ variant: 'success', title: 'Simulation complete', description: `Projection for ${city} over ${time} years` });
      scrollToSection(resultRef);
    } catch {
      pushToast({ variant: 'error', title: 'Simulation failed' });
    } finally {
      setAiLoading(false);
    }
  };

  const getSuggestions = (query: string) => {
    if (!query) return t.suggestions.slice(0, 5);
    return t.suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  // When result is ready, scroll and animate reveal
  useEffect(() => {
    if (simulationResult) {
      requestAnimationFrame(() => {
        scrollToSection(resultRef);
        setResultAnimate(true);
        setResultGlow(true);
        setTimeout(() => setResultGlow(false), 1500);
      });
    } else {
      setResultAnimate(false);
    }
  }, [simulationResult]);

  // Dynamic result header text based on source (planner vs simulation)
  const resultTitleText =
    simulationResult?.from === 'planner'
      ? (currentLanguage === 'ur' ? 'Aap Ka Goal Result' : 'Your Goal Result')
      : (currentLanguage === 'ur' ? 'Aap Ka Simulation Result' : 'Your Simulation Result');

  // Formatting helpers
  const formatPKR = (n?: number) => typeof n === 'number' ? `PKR ${n.toLocaleString()}` : '—';
  const formatPKRk = (n?: number) => typeof n === 'number' ? `PKR ${(n/1000).toFixed(0)}k` : '—';

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

      {/* AI Loader Overlay */}
      {aiLoading && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white/95 rounded-2xl border border-gray-200 shadow-2xl p-6 w-[90vw] max-w-md">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">AI is preparing your plan…</div>
                <div className="text-sm text-gray-600">{aiMessage}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">Tip: You can tweak inputs and run again.</div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-[1400] space-y-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg border text-sm ${
              t.variant === 'success' ? 'bg-white border-green-200 text-gray-900' :
              t.variant === 'error' ? 'bg-white border-red-200 text-gray-900' :
              'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description ? <div className="text-gray-600">{t.description}</div> : null}
          </div>
        ))}
      </div>

      <div className="min-h-screen pt-16 relative overflow-hidden">
        {/* Frame 1: Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81]">
          {/* Background blobs */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl animate-pulse-custom"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-float"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 leading-tight font-display">
              {t.heroTitle}
            </h1>

            <div className="relative max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 z-10" />
                <div className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white/60 text-lg backdrop-blur-sm h-[58px] flex items-center overflow-hidden">
                  <span>{typedMain}</span>
                  <span className="animate-blink w-0.5 h-6 bg-white/60 ml-1"></span>
                </div>
              </div>

              {showSuggestions && getSuggestions(searchQuery).length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl overflow-hidden z-[100] shadow-xl animate-fadeIn">
                  {getSuggestions(searchQuery).map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 text-gray-900 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                        scrollToSection(goalsRef);
                      }}
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => scrollToSection(goalsRef)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 text-lg hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
              >
                <Target className="w-5 h-5 mr-2" />
                {t.goalBtn}
              </Button>
              <Button
                onClick={() => scrollToSection(simulateRef)}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                {t.simulateBtn}
              </Button>
            </div>
          </div>
        </section>

        {/* Frame 2: Goals Section */}
        <section ref={goalsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 font-display">
              {t.goalsTitle}
            </h2>

            {/* Compact Professional Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
              {t.goals.map((goal, index) => {
                const IconComponent = goal.icon;

                return (
                  <article
                    key={index}
                    role="button"
                    aria-label={`Plan goal ${goal.name}`}
                    onKeyDown={(e) => { if (e.key === 'Enter') openPlanner(goal.name); }}
                    onClick={() => openPlanner(goal.name)}
                    tabIndex={0}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] overflow-hidden border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-purple-400 "
                  >
                    <div className="flex flex-col md:flex-row h-full min-h-[200px]">
                      <div className="md:w-2/5 w-full h-24 md:h-full overflow-hidden md:rounded-l-xl rounded-t-xl flex-shrink-0">
                        <img
                          src={goal.image}
                          alt={goal.name}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>

                      <div className="md:w-3/5 w-full p-3 flex flex-col justify-between md:rounded-r-xl rounded-b-xl">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1 bg-purple-50 rounded-md inline-flex items-center justify-center">
                              {IconComponent ? <IconComponent className="w-4 h-4 text-purple-600" /> : null}
                            </div>
                            <h3 className="text-xs font-semibold text-gray-900 truncate">{goal.name}</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-2 leading-tight line-clamp-3 whitespace-pre-line">
                            {goal.desc}
                          </p>
                        </div>
                        <div className="mt-1">
                          <Button
                            onClick={(e) => { e.stopPropagation(); openPlanner(goal.name); }}
                            variant="glow"
                            className="w-full font-medium py-1 text-xs hover-target hover-lift"
                            aria-label={`Plan ${goal.name}`}
                          >
                            Plan this goal →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Frame 3: Simulation Inputs - Dark Theme */}
        <section ref={simulateRef} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81]">
          {/* Background blobs */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl animate-pulse-custom"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 font-display">
              {t.simulateTitle}
            </h2>

            {/* Input Grid - single column on small, two on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* City */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <label className="block text-white font-semibold mb-3 text-lg">{t.city}</label>
                <input
                  type="text"
                  value={simulationInputs.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={simCityPlaceholder}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-base sm:text-lg font-semibold placeholder:text-white/60 min-w-0"
                />
              </div>

              {/* Time (years) */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <label className="block text-white font-semibold mb-3 text-lg">{t.time}</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInputChange('time', Math.max(1, Number(simulationInputs.time) - 1))}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="decrease time"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    value={simulationInputs.time || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                      handleInputChange('time', value);
                    }}
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-base sm:text-lg font-semibold min-w-0"
                    min="1"
                    step="1"
                  />
                  <button
                    onClick={() => handleInputChange('time', Number(simulationInputs.time) + 1)}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="increase time"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* ROI (%) */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <label className="block text-white font-semibold mb-3 text-lg">{t.roi}</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInputChange('roi', Math.max(0, Number(simulationInputs.roi) - 1))}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="decrease roi"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    value={simulationInputs.roi || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                      handleInputChange('roi', value);
                    }}
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-base sm:text-lg font-semibold min-w-0"
                    min="0"
                    step="1"
                  />
                  <button
                    onClick={() => handleInputChange('roi', Number(simulationInputs.roi) + 1)}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="increase roi"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Inflation (%) */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <label className="block text-white font-semibold mb-3 text-lg">{t.inflation}</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInputChange('inflationRate', Math.max(0, Number(simulationInputs.inflationRate) - 1))}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="decrease inflation"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    value={simulationInputs.inflationRate || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                      handleInputChange('inflationRate', value);
                    }}
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-base sm:text-lg font-semibold min-w-0"
                    min="0"
                    step="1"
                  />
                  <button
                    onClick={() => handleInputChange('inflationRate', Number(simulationInputs.inflationRate) + 1)}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="increase inflation"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* One-time Investment */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <label className="block text-white font-semibold mb-3 text-lg">{t.initialAmount}</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInputChange('initialAmount', Math.max(0, Number(simulationInputs.initialAmount) - 10000))}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="decrease initial"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    value={simulationInputs.initialAmount || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                      handleInputChange('initialAmount', value);
                    }}
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-base sm:text-lg font-semibold min-w-0"
                    min="0"
                    step="1000"
                  />
                  <button
                    onClick={() => handleInputChange('initialAmount', Number(simulationInputs.initialAmount) + 10000)}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="increase initial"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Monthly Investment */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <label className="block text-white font-semibold mb-3 text-lg">{t.monthlyInvestment}</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInputChange('monthlyInvestment', Math.max(0, Number(simulationInputs.monthlyInvestment) - 1000))}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="decrease monthly"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    value={simulationInputs.monthlyInvestment || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                      handleInputChange('monthlyInvestment', value);
                    }}
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-base sm:text-lg font-semibold min-w-0"
                    min="0"
                    step="500"
                  />
                  <button
                    onClick={() => handleInputChange('monthlyInvestment', Number(simulationInputs.monthlyInvestment) + 1000)}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 flex-shrink-0"
                    aria-label="increase monthly"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center">
              <Button
                onClick={runSimulation}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 sm:px-12 py-3 sm:py-4 text-lg hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Calculator className="w-5 h-5 mr-2" />
                {t.calculateBtn}
              </Button>
            </div>
          </div>
        </section>

        {/* Frame 4: Unified Result */}
        {simulationResult && (
          <section
            ref={resultRef}
            className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative z-10 transform transition-all duration-700 ease-out ${
              resultAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
          >
            <div className={`max-w-6xl mx-auto ${resultGlow ? 'ring-2 ring-purple-400/60 rounded-2xl animate-pulse' : ''}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 font-display">
                {resultTitleText}
              </h2>
              <p className="text-gray-600 text-center mb-12">
                {simulationResult.from === 'planner'
                  ? (simulationResult.meta?.goalName ? `${simulationResult.meta.goalName} • ${simulationResult.meta.city} • ${simulationResult.meta?.targetYear}` : 'Goal plan generated')
                  : (simulationResult.meta?.city ? `Projection for ${simulationResult.meta.city}` : 'Custom plan projection')}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Results Summary */}
                <div className="space-y-4">
                  {/* Progress Card */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-purple-400 font-medium">
                          {simulationResult.from === 'planner' ? (simulationResult.meta?.goalName || 'Goal') : 'Simulation'}
                        </span>
                      </div>
                      <span className="text-gray-900 font-bold">
                        {formatPKR(simulationResult.totalInvestment)} / {formatPKR(simulationResult.finalAmount)}
                      </span>
                    </div>
                    <div className="mb-2 text-sm text-gray-600">
                      {simulationResult.from === 'planner'
                        ? `Target Year: ${simulationResult.meta?.targetYear || '—'}`
                        : `Duration: ${simulationInputs.time} years`}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      {(() => {
                        const numer = simulationResult.totalInvestment ?? (simulationInputs.initialAmount + simulationInputs.monthlyInvestment * 12 * simulationInputs.time);
                        const denom = Math.max(simulationResult.finalAmount || 1, 1);
                        const pct = Math.max(5, Math.min(100, Math.round((numer / denom) * 100)));
                        return <div className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full" style={{ width: `${pct}%` }} />;
                      })()}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Progress is an estimate based on total investment vs projected final amount.</div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Final Amount</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{formatPKRk(simulationResult.finalAmount)}</div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Total Investment</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPKRk(simulationResult.totalInvestment ?? (simulationInputs.initialAmount + simulationInputs.monthlyInvestment * 12 * simulationInputs.time))}
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600 text-sm">ROI / Inflation</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {simulationResult.meta?.roiRate ?? simulationInputs.roi}% / {simulationResult.meta?.inflationRate ?? simulationInputs.inflationRate}%
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Monthly Contribution</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPKRk(simulationResult.monthlyInvestment || simulationInputs.monthlyInvestment)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Progress Projection</h3>
                    <span className="text-gray-600 font-semibold">
                      {simulationResult.from === 'planner'
                        ? formatPKRk(simulationResult.finalAmount)
                        : formatPKRk(simulationResult.chartData?.[0]?.amount)}
                    </span>
                  </div>
                  <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulationResult.chartData}>
                        <XAxis 
                          dataKey="year" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#9CA3AF' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#9CA3AF' }}
                          tickFormatter={(v) => `PKR ${(v/1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }}
                          formatter={(value: number) => [`PKR ${Math.round(value).toLocaleString()}`, 'Projected']}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="url(#gradient)"
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#F59E0B' }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#F59E0B" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">Years → Progress Timeline</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Goal Planner Modal */}
        {plannerOpen && (
          <div className="fixed inset-0 z-[1200]">
            <div className="absolute inset-0 bg-black/50" onClick={() => !plannerLoading && setPlannerOpen(false)} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Goal Planner</h3>
              <p className="text-sm text-gray-500 mb-5">Enter a city and select a target year to generate your plan.</p>

              <div className="space-y-4">
                <div>
                  {/* label -> black */}
                  <label className="block text-sm font-medium text-black mb-1">Goal Name</label>
                  {/* input -> black text */}
                  <input
                    type="text"
                    value={selectedGoalName || ''}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-black"
                  />
                </div>

                {isPilgrimage && (
                  <div>
                    {/* label -> black */}
                    <label className="block text-sm font-medium text-black mb-1">Journey Type</label>
                    {/* select -> black text */}
                    <select
                      value={plannerSubType}
                      onChange={(e) => setPlannerSubType(e.target.value as 'Umrah' | 'Hajj')}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="Umrah">Umrah</option>
                      <option value="Hajj">Hajj</option>
                    </select>
                  </div>
                )}

                <div>
                  {/* label -> black */}
                  <label className="block text-sm font-medium text-black mb-1">City</label>
                  {/* input -> black text + black placeholder */}
                  <input
                    type="text"
                    placeholder={plannerCityPlaceholder}
                    value={plannerCity}
                    onChange={(e) => setPlannerCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div>
                  {/* label -> black */}
                  <label className="block text-sm font-medium text-black mb-1">Target Year</label>
                  {/* select -> black text */}
                  <select
                    value={plannerYear}
                    onChange={(e) => setPlannerYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Year must be greater than 2025.</p>
                </div>

                {plannerError ? (
                  <div className="text-sm text-red-600">{plannerError}</div>
                ) : null}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  className="text-gray-700"
                  onClick={() => setPlannerOpen(false)}
                  disabled={plannerLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePlannerSubmit}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  disabled={
                    plannerLoading ||
                    !plannerCity ||
                    plannerYear <= 2025 ||
                    (isPilgrimage && !plannerSubType)
                  }
                >
                  {plannerLoading ? 'Generating...' : 'Generate Plan'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
