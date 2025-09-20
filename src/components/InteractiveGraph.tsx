import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboard } from './DashboardContext';
import { motion } from 'framer-motion';

export const InteractiveGraph = () => {
  const { currentLanguage } = useDashboard();
  const [selectedPeriod, setSelectedPeriod] = useState<'1 Year' | '3 Years' | '5 Years'>('1 Year');

  const content = {
    en: {
      title: 'See the Power of Smart Investing',
      subtitle: 'Compare traditional saving vs NafaVerse investing',
      saving: 'Just Saving',
      investing: 'NafaVerse Investing',
      periods: ['1 Year', '3 Years', '5 Years']
    },
    ur: {
      title: 'Smart investing ki power dekhein',
      subtitle: 'Riwayati bachat vs NafaVerse investing',
      saving: 'Sirf Saving',
      investing: 'NafaVerse Investing',
      periods: ['1 saal', '3 saal', '5 saal']
    }
  } as const;

  const t = content[currentLanguage] || content.en;

  const graphData = {
    '1 Year': [
      { month: 'Jan', saving: 1000, investing: 1000 },
      { month: 'Mar', saving: 3000, investing: 3200 },
      { month: 'Jun', saving: 6000, investing: 6800 },
      { month: 'Sep', saving: 9000, investing: 10800 },
      { month: 'Dec', saving: 12000, investing: 15000 }
    ],
    '3 Years': [
      { month: 'Y1', saving: 12000, investing: 15000 },
      { month: 'Y1.5', saving: 18000, investing: 24000 },
      { month: 'Y2', saving: 24000, investing: 35000 },
      { month: 'Y2.5', saving: 30000, investing: 48000 },
      { month: 'Y3', saving: 36000, investing: 65000 }
    ],
    '5 Years': [
      { month: 'Y1', saving: 12000, investing: 15000 },
      { month: 'Y2', saving: 24000, investing: 35000 },
      { month: 'Y3', saving: 36000, investing: 65000 },
      { month: 'Y4', saving: 48000, investing: 110000 },
      { month: 'Y5', saving: 60000, investing: 180000 }
    ]
  } as const;

  const data = graphData[selectedPeriod];
  const basePeriods = ['1 Year', '3 Years', '5 Years'] as const;

  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81]">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <div className="rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
          {/* Period Toggle Buttons */}
          <div className="flex justify-center mb-6">
            <div className="bg-black/20 p-1 rounded-full inline-flex items-center space-x-1">
              {t.periods.map((period, index) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(basePeriods[index])}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 focus:outline-none ${
                    selectedPeriod === basePeriods[index]
                      ? 'text-gray-900'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {selectedPeriod === basePeriods[index] && (
                    <motion.div
                      layoutId="active-graph-period"
                      className="absolute inset-0 bg-[#00B8A9] rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{period}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Graph */}
          <div className="h-[320px] sm:h-[380px] md:h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `PKR ${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `PKR ${value.toLocaleString()}`,
                    name === 'saving' ? t.saving : t.investing
                  ]}
                  labelStyle={{ color: '#1E293B', fontWeight: 'bold' }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #cbd5e1', borderRadius: 12, backdropFilter: 'blur(5px)' }}
                  itemStyle={{ color: '#334155' }}
                />
                <Legend wrapperStyle={{ color: '#cbd5e1', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="saving" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} name={t.saving} />
                <Line type="monotone" dataKey="investing" stroke="#00B8A9" strokeWidth={3} dot={{ r: 4 }} name={t.investing} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
            <div className="rounded-xl p-4 sm:p-6 bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 font-medium">{t.saving}</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-300">
                    PKR {data[data.length - 1].saving.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-full">
                  <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
                </div>
              </div>
            </div>
            
            <div className="rounded-xl p-4 sm:p-6 bg-[#00B8A9]/10 border border-[#00B8A9]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-medium">{t.investing}</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#00B8A9]">
                    PKR {data[data.length - 1].investing.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-full">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};