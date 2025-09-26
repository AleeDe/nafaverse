import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Target, TrendingUp, Calculator, Plus, Minus, MapPin, GraduationCap, Home, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../components/ui/button';
import { useDashboard } from '../components/DashboardContext';

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
  const { currentLanguage } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [goalSearchQuery, setGoalSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);
  const [simulationInputs, setSimulationInputs] = useState({
    roi: 12,
    time: 5,
    initialAmount: 50000,
    targetAmount: 500000
  });
  const [simulationResult, setSimulationResult] = useState<any>(null);

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
      calculateBtn: 'Calculate',
      startPlanning: 'Start Planning',
      roi: 'ROI (%)',
      time: 'Time (years)',
      initialAmount: 'Initial Amount (PKR)',
      targetAmount: 'Target Amount (PKR)',
      goals: [
        { 
          name: 'Umrah / Hajj', 
          desc: 'Plan your spiritual journey with our Islamic-compliant savings and investment options designed for pilgrimage goals.',
          amount: 'PKR 300k',
          duration: '12-18 months',
          image: '/images/kaaba image final.jpg',
          icon: MapPin
        },
        { 
          name: 'Private Home', 
          desc: 'Build wealth for major purchases with smart investment strategies and down payment planning.',
          amount: 'PKR 5000k',
          duration: '3-5 years',
          image: '/images/home image.jpg',
          icon: Home
        },
        { 
          name: 'Study Abroad', 
          desc: 'Achieve your international education goals with structured savings plans and scholarship guidance.',
          amount: 'PKR 2000k',
          duration: '2-3 years',
          image: '/images/univeristy image.jpg',
          icon: GraduationCap
        },
        { 
          name: 'Small Business', 
          desc: 'Fund your entrepreneurial vision with business-focused financial planning and growth strategies.',
          amount: 'PKR 1000k',
          duration: '1-2 years',
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
      calculateBtn: 'Calculate',
      startPlanning: 'Planning Shuru Karein',
      roi: 'ROI (%)',
      time: 'Waqt (saal)',
      initialAmount: 'Shuru Ki Raqam (PKR)',
      targetAmount: 'Target Raqam (PKR)',
      goals: [
        { 
          name: 'Umrah / Hajj', 
          desc: 'Islamic-compliant savings aur investment options ke saath apna spiritual journey plan karein.',
          amount: 'PKR 300k',
          duration: '12-18 mahine',
          image: '/images/kaaba image final.jpg',
          icon: MapPin
        },
        { 
          name: 'Ghar', 
          desc: 'Smart investment strategies aur down payment planning ke saath wealth build karein.',
          amount: 'PKR 5000k',
          duration: '3-5 saal',
          image: '/images/home image.jpg',
          icon: Home
        },
        { 
          name: 'Bahar Parhai', 
          desc: 'Structured savings plans aur scholarship guidance ke saath international education goals achieve karein.',
          amount: 'PKR 2000k',
          duration: '2-3 saal',
          image: '/images/univeristy image.jpg',
          icon: GraduationCap
        },
        { 
          name: 'Business', 
          desc: 'Business-focused financial planning aur growth strategies ke saath entrepreneurial vision fund karein.',
          amount: 'PKR 1000k',
          duration: '1-2 saal',
          image: '/images/startup.jpg',
          icon: Building2
        }
      ],
      suggestions: ['Shadi', 'Retirement', 'Gari', 'Emergency Fund', 'Bachon Ki Taleem', 'Vacation', 'Medical Emergency', 'Property Investment'],
      placeholders: ['Shadi ke goals search karein...', 'Retirement plans dhundein...', 'Gari financing dekhein...', 'Emergency fund planning...', 'Taleem ki savings...']
    }
  };

  const t = content[currentLanguage];

  // Stable phrases list per language
  const heroPhrases = useMemo(() => t.placeholders.slice(), [currentLanguage]);
  const typedMain = useTypewriter(heroPhrases, { typeSpeed: 70, pause: 1600, backspace: false });

  // Add: goal search placeholder typing state
  const [goalPlaceholderIdx, setGoalPlaceholderIdx] = useState(0);
  const [typedGoalText, setTypedGoalText] = useState('');

  // Add: phrases for the goal search placeholder (EN/UR)
  const goalPlaceholderPhrases = useMemo(
    () =>
      currentLanguage === 'ur'
        ? [
            'Shadi ke goals dhoondh rahe hain...',
            'Ghar ke goals dhoondh rahe hain...',
            'Umrah ke goals dhoondh rahe hain...',
          ]
        : [
            'Searching for marriage goals...',
            'Searching for house goals...',
            'Searching for Umrah goals...',
          ],
    [currentLanguage]
  );

  // Live typing effect for goal search
  useEffect(() => {
    if (goalSearchQuery) {
      setTypedGoalText('');
      return;
    }
    let i = 0;
    let cancelled = false;
    const phrase =
      goalPlaceholderPhrases[goalPlaceholderIdx % goalPlaceholderPhrases.length] || '';

    const type = () => {
      if (cancelled) return;
      if (i <= phrase.length) {
        setTypedGoalText(phrase.slice(0, i));
        i += 1;
        window.setTimeout(type, 60);
      } else {
        window.setTimeout(() => {
          if (cancelled) return;
          setTypedGoalText('');
          setGoalPlaceholderIdx((prev) => (prev + 1) % goalPlaceholderPhrases.length);
        }, 1300);
      }
    };

    type();
    return () => {
      cancelled = true;
    };
  }, [goalSearchQuery, goalPlaceholderIdx, goalPlaceholderPhrases]);

  const handleInputChange = (field: string, value: number) => {
    setSimulationInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateSimulation = () => {
    const { roi, time, initialAmount, targetAmount } = simulationInputs;
    const monthlyRate = roi / 100 / 12;
    const months = time * 12;
    
    // Calculate required monthly investment
    const monthlyInvestment = (targetAmount - initialAmount * Math.pow(1 + monthlyRate, months)) / 
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));

    // Generate chart data
    const chartData = [];
    let currentAmount = initialAmount;
    for (let year = 0; year <= time; year++) {
      chartData.push({
        year: year,
        amount: Math.round(currentAmount)
      });
      currentAmount = currentAmount * (1 + roi/100) + (monthlyInvestment * 12);
    }

    setSimulationResult({
      monthlyInvestment: Math.round(monthlyInvestment),
      finalAmount: Math.round(currentAmount),
      chartData
    });

    scrollToSection(resultRef);
  };

  const getSuggestions = (query: string) => {
    if (!query) return t.suggestions.slice(0, 5);
    return t.suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  return (
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
          
            {/* Live typing display only (no input/dropdown) */}
            <div className="relative max-w-2xl mx-auto mb-12">
            <div
              aria-live="polite"
              className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white text-lg backdrop-blur-sm"
            >
              {typedMain || heroPhrases[0]}
              <span className="ml-1 opacity-80 animate-pulse">|</span>
            </div>
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

      {/* Frame 2: Goals Section - Light Theme */}
      <section ref={goalsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 font-display">
            {t.goalsTitle}
          </h2>

          {/* Compact Professional Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            {t.goals.map((goal, index) => {
              const IconComponent = goal.icon;

              const parseGoalAmount = (amountStr: string) => {
                if (!amountStr) return simulationInputs.targetAmount;
                let s = amountStr.replace(/PKR|\s|,/gi, '').toLowerCase();
                let mult = 1;
                if (s.endsWith('k')) {
                  mult = 1000;
                  s = s.slice(0, -1);
                } else if (s.endsWith('m')) {
                  mult = 1000000;
                  s = s.slice(0, -1);
                }
                const n = parseFloat(s) || 0;
                return Math.round(n * mult);
              };

              const handleStartGoal = () => {
                const parsed = parseGoalAmount(goal.amount);
                setSimulationInputs(prev => ({ ...prev, targetAmount: parsed }));
                // smooth scroll to simulation and focus first input
                scrollToSection(simulateRef);
                // optionally focus target input, give small timeout for scroll
                setTimeout(() => {
                  const el = document.querySelector<HTMLInputElement>('input[name="targetAmount"]');
                  el?.focus();
                }, 480);
              };

              return (
                <article
                  key={index}
                  role="button"
                  aria-label={`Start goal ${goal.name}`}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleStartGoal(); }}
                  onClick={handleStartGoal}
                  tabIndex={0}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] overflow-hidden border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image — left on md+, top on mobile */}
                    <div className="md:w-2/5 w-full h-44 md:h-auto overflow-hidden md:rounded-l-xl rounded-t-xl flex-shrink-0">
                      <img
                        src={goal.image}
                        alt={goal.name}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>

                    {/* Text content */}
                    <div className="md:w-3/5 w-full p-5 flex flex-col justify-between md:rounded-r-xl rounded-b-xl">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-purple-50 rounded-md inline-flex items-center justify-center">
                            {IconComponent ? <IconComponent className="w-5 h-5 text-purple-600" /> : null}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900">{goal.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {goal.desc}
                        </p>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="font-semibold text-teal-600">{goal.amount}</span>
                          <span className="text-xs">•</span>
                          <span>{goal.duration}</span>
                        </div>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleStartGoal(); }}
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-lg hover:shadow-md transition-all duration-300 text-sm"
                          aria-label={`Start ${goal.name}`}
                        >
                          Start Goal →
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Goal Search with Live Typing */}
          <div className="max-w-2xl mx-auto relative z">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  goalSearchQuery
                    ? t.goalSearchPlaceholder
                    : typedGoalText || goalPlaceholderPhrases[goalPlaceholderIdx]
                }
                value={goalSearchQuery}
                onChange={(e) => setGoalSearchQuery(e.target.value)}
                onFocus={() => setShowGoalSuggestions(true)}
                onBlur={() => setTimeout(() => setShowGoalSuggestions(false), 200)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 shadow-lg transition-all duration-300"
              />
            </div>
            
            {showGoalSuggestions && getSuggestions(goalSearchQuery).length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl overflow-hidden z-20 shadow-xl animate-fadeIn">
                {getSuggestions(goalSearchQuery).map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 text-gray-900 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    onClick={() => {
                      setGoalSearchQuery(suggestion);
                      setShowGoalSuggestions(false);
                    }}
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
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

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* ROI Input */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <label className="block text-white font-semibold mb-4 text-lg">{t.roi}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('roi', Math.max(1, simulationInputs.roi - 1))}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.roi}
                  onChange={(e) => handleInputChange('roi', Number(e.target.value))}
                  className="flex-1 px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg font-semibold"
                />
                <button
                  onClick={() => handleInputChange('roi', simulationInputs.roi + 1)}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Time Input */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <label className="block text-white font-semibold mb-4 text-lg">{t.time}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('time', Math.max(1, simulationInputs.time - 1))}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.time}
                  onChange={(e) => handleInputChange('time', Number(e.target.value))}
                  className="flex-1 px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg font-semibold"
                />
                <button
                  onClick={() => handleInputChange('time', simulationInputs.time + 1)}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Initial Amount Input */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <label className="block text-white font-semibold mb-4 text-lg">{t.initialAmount}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('initialAmount', Math.max(0, simulationInputs.initialAmount - 10000))}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.initialAmount}
                  onChange={(e) => handleInputChange('initialAmount', Number(e.target.value))}
                  className="flex-1 px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg font-semibold"
                />
                <button
                  onClick={() => handleInputChange('initialAmount', simulationInputs.initialAmount + 10000)}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Target Amount Input */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <label className="block text-white font-semibold mb-4 text-lg">{t.targetAmount}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('targetAmount', Math.max(simulationInputs.initialAmount, simulationInputs.targetAmount - 50000))}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', Number(e.target.value))}
                  className="flex-1 px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg font-semibold"
                />
                <button
                  onClick={() => handleInputChange('targetAmount', simulationInputs.targetAmount + 50000)}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Calculate Button - Signup Style */}
          <div className="text-center">
            <Button
              onClick={calculateSimulation}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-12 py-4 text-lg hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {t.calculateBtn}
            </Button>
          </div>
        </div>
      </section>

      {/* Frame 4: Simulation Result - Light Theme */}
      {simulationResult && (
        <section ref={resultRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 font-display">
              {t.resultTitle}
            </h2>
            <p className="text-gray-600 text-center mb-12">Define a goal above to see your progress.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Results Summary - Sleek Cards */}
              <div className="space-y-4">
                {/* Sample Goal Progress */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-400 font-medium">Sample Goal</span>
                    </div>
                    <span className="text-gray-900 font-bold">PKR {simulationInputs.initialAmount.toLocaleString()} / PKR {simulationInputs.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">35% completed</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Target Amount</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">PKR {(simulationInputs.targetAmount/1000).toFixed(0)}k</div>
                  </div>
                  
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Amount Saved</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">PKR {(simulationInputs.initialAmount/1000).toFixed(0)}k</div>
                  </div>
                  
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Estimated Completion</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Dec 2025</div>
                  </div>
                  
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Monthly Contribution</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">PKR {simulationResult.monthlyInvestment > 0 ? (simulationResult.monthlyInvestment/1000).toFixed(0) + 'k' : '5k'}</div>
                  </div>
                </div>
              </div>

              {/* Sleek Modern Chart */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Progress Projection</h3>
                  <span className="text-sm text-gray-500">PKR 100k</span>
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
                        formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Amount']}
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
                  <span className="text-sm text-gray-500">Months → Progress Timeline</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};