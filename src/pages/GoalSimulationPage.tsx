import React, { useState, useRef, useEffect } from 'react';
import { Search, Target, TrendingUp, Calculator, Plus, Minus, MapPin, GraduationCap, Home, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Button } from '../components/ui/button';
import { useDashboard } from '../components/DashboardContext';

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
      suggestions: ['Marriage', 'Retirement', 'Car Purchase', 'Emergency Fund', 'Child Education', 'Vacation', 'Medical Emergency', 'Property Investment']
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
      suggestions: ['Shadi', 'Retirement', 'Gari', 'Emergency Fund', 'Bachon Ki Taleem', 'Vacation', 'Medical Emergency', 'Property Investment']
    }
  };

  const t = content[currentLanguage];

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

  const getSuggestions = (query: string, isGoalSearch: boolean = false) => {
    if (!query) return [];
    return t.suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  // Live typing effect for main search
  useEffect(() => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Live typing effect for goal search
  useEffect(() => {
    if (goalSearchQuery.length > 0) {
      setShowGoalSuggestions(true);
    } else {
      setShowGoalSuggestions(false);
    }
  }, [goalSearchQuery]);

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      {/* Frame 1: Hero Section - Dark Theme */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81]">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl animate-pulse-custom"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-float"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 leading-tight">
            {t.heroTitle}
          </h1>
          
          {/* Search Bar with Live Typing */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg backdrop-blur-sm"
              />
            </div>
            
            {/* Live Suggestions Dropdown */}
            {showSuggestions && getSuggestions(searchQuery).length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-20 animate-fadeIn">
                {getSuggestions(searchQuery).map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0 flex items-center gap-3"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
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

      {/* Frame 2: Goals Section - Light Theme */}
      <section ref={goalsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            {t.goalsTitle}
          </h2>

          {/* Professional Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {t.goals.map((goal, index) => {
              const IconComponent = goal.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden border border-gray-100">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{goal.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-semibold text-purple-600">{goal.amount}</span>
                            <span>•</span>
                            <span>{goal.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img 
                          src={goal.image} 
                          alt={goal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {goal.desc}
                    </p>
                    
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300">
                      {t.startPlanning}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Goal Search with Live Typing */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.goalSearchPlaceholder}
                value={goalSearchQuery}
                onChange={(e) => setGoalSearchQuery(e.target.value)}
                onFocus={() => goalSearchQuery.length > 0 && setShowGoalSuggestions(true)}
                onBlur={() => setTimeout(() => setShowGoalSuggestions(false), 200)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 shadow-lg"
              />
            </div>
            
            {/* Live Goal Suggestions Dropdown */}
            {showGoalSuggestions && getSuggestions(goalSearchQuery, true).length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl overflow-hidden z-20 shadow-xl animate-fadeIn">
                {getSuggestions(goalSearchQuery, true).map((suggestion, index) => (
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
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
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
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              {t.resultTitle}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Results Summary */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Monthly Investment:</span>
                    <span className="text-gray-900 font-bold text-lg">PKR {simulationResult.monthlyInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Initial Amount:</span>
                    <span className="text-gray-900 font-bold text-lg">PKR {simulationInputs.initialAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Target Amount:</span>
                    <span className="text-purple-600 font-bold text-lg">PKR {simulationInputs.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Time Period:</span>
                    <span className="text-gray-900 font-bold text-lg">{simulationInputs.time} years</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">Expected ROI:</span>
                    <span className="text-green-600 font-bold text-lg">{simulationInputs.roi}%</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Growth Projection</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationResult.chartData}>
                      <XAxis dataKey="year" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};