import React, { useState, useRef } from 'react';
import { Search, Target, TrendingUp, Calculator, Plus, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Button } from '../components/ui/button';
import { useDashboard } from '../components/DashboardContext';

export const GoalSimulationPage: React.FC = () => {
  const { currentLanguage } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [goalSearchQuery, setGoalSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
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
      roi: 'ROI (%)',
      time: 'Time (years)',
      initialAmount: 'Initial Amount (PKR)',
      targetAmount: 'Target Amount (PKR)',
      goals: [
        { name: 'Hajj/Umrah', desc: 'Sacred journey to Makkah', image: '🕋' },
        { name: 'Dream House', desc: 'Your own home', image: '🏠' },
        { name: 'Study Abroad', desc: 'International education', image: '🎓' },
        { name: 'Start Business', desc: 'Your own startup', image: '💼' }
      ],
      suggestions: ['Marriage', 'Retirement', 'Car Purchase', 'Emergency Fund', 'Child Education']
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
      roi: 'ROI (%)',
      time: 'Waqt (saal)',
      initialAmount: 'Shuru Ki Raqam (PKR)',
      targetAmount: 'Target Raqam (PKR)',
      goals: [
        { name: 'Hajj/Umrah', desc: 'Makkah ka muqaddas safar', image: '🕋' },
        { name: 'Ghar', desc: 'Apna ghar', image: '🏠' },
        { name: 'Bahar Parhai', desc: 'International taleem', image: '🎓' },
        { name: 'Business', desc: 'Apna startup', image: '💼' }
      ],
      suggestions: ['Shadi', 'Retirement', 'Gari', 'Emergency Fund', 'Bachon Ki Taleem']
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

  const getSuggestions = () => {
    if (!goalSearchQuery) return [];
    return t.suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(goalSearchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] pt-16">
      {/* Frame 1: Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 leading-tight">
            {t.heroTitle}
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => scrollToSection(goalsRef)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 text-lg hover:shadow-lg hover:shadow-purple-500/30"
            >
              <Target className="w-5 h-5 mr-2" />
              {t.goalBtn}
            </Button>
            <Button
              onClick={() => scrollToSection(simulateRef)}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {t.simulateBtn}
            </Button>
          </div>
        </div>
      </section>

      {/* Frame 2: Goals Section */}
      <section ref={goalsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {t.goalsTitle}
          </h2>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {t.goals.map((goal, index) => (
              <div key={index} className="nv-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{goal.name}</h3>
                    <p className="text-purple-100/80">{goal.desc}</p>
                  </div>
                  <div className="text-4xl ml-4">{goal.image}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Goal Search */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.goalSearchPlaceholder}
                value={goalSearchQuery}
                onChange={(e) => {
                  setGoalSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(goalSearchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && getSuggestions().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-10">
                {getSuggestions().map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => {
                      setGoalSearchQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Frame 3: Simulation Inputs */}
      <section ref={simulateRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {t.simulateTitle}
          </h2>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* ROI Input */}
            <div className="nv-card p-6">
              <label className="block text-white font-semibold mb-4">{t.roi}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('roi', Math.max(1, simulationInputs.roi - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.roi}
                  onChange={(e) => handleInputChange('roi', Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={() => handleInputChange('roi', simulationInputs.roi + 1)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Time Input */}
            <div className="nv-card p-6">
              <label className="block text-white font-semibold mb-4">{t.time}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('time', Math.max(1, simulationInputs.time - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.time}
                  onChange={(e) => handleInputChange('time', Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={() => handleInputChange('time', simulationInputs.time + 1)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Initial Amount Input */}
            <div className="nv-card p-6">
              <label className="block text-white font-semibold mb-4">{t.initialAmount}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('initialAmount', Math.max(0, simulationInputs.initialAmount - 10000))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.initialAmount}
                  onChange={(e) => handleInputChange('initialAmount', Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={() => handleInputChange('initialAmount', simulationInputs.initialAmount + 10000)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Target Amount Input */}
            <div className="nv-card p-6">
              <label className="block text-white font-semibold mb-4">{t.targetAmount}</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleInputChange('targetAmount', Math.max(simulationInputs.initialAmount, simulationInputs.targetAmount - 50000))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={simulationInputs.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={() => handleInputChange('targetAmount', simulationInputs.targetAmount + 50000)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center">
            <Button
              onClick={calculateSimulation}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-4 text-lg hover:shadow-lg hover:shadow-green-500/30"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {t.calculateBtn}
            </Button>
          </div>
        </div>
      </section>

      {/* Frame 4: Simulation Result */}
      {simulationResult && (
        <section ref={resultRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              {t.resultTitle}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Results Summary */}
              <div className="nv-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Investment Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Monthly Investment:</span>
                    <span className="text-white font-bold">PKR {simulationResult.monthlyInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Initial Amount:</span>
                    <span className="text-white font-bold">PKR {simulationInputs.initialAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Target Amount:</span>
                    <span className="text-white font-bold">PKR {simulationInputs.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Time Period:</span>
                    <span className="text-white font-bold">{simulationInputs.time} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Expected ROI:</span>
                    <span className="text-white font-bold">{simulationInputs.roi}%</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="nv-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Growth Projection</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationResult.chartData}>
                      <XAxis dataKey="year" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#00B8A9" 
                        strokeWidth={3}
                        dot={{ fill: '#00B8A9', r: 4 }}
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