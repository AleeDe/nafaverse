import React, { useState } from 'react';
import { ChevronRight, Shield, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import SurveyForm from './components/SurveyForm';
import SurveyClosedPage from './components/SurveyClosedPage';

function App() {
  // Survey control - set to false to show closed page, true to show survey
  const isSurveyActive = new URLSearchParams(window.location.search).get('active') === 'true';
  
  const [showSurvey, setShowSurvey] = useState(false);

  // If survey is not active, show closed page
  if (!isSurveyActive) {
    return <SurveyClosedPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {!showSurvey ? (
        <LandingPage onStartSurvey={() => setShowSurvey(true)} />
      ) : (
        <SurveyForm onBack={() => setShowSurvey(false)} />
      )}
    </div>
  );
}

function LandingPage({ onStartSurvey }: { onStartSurvey: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-blue-800/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">NafaVerse</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-blue-200">
              <Shield className="w-4 h-4" />
              <span className="text-sm">100% Anonymous Survey</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Master Money Like the 
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"> Top 1%</span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your safe space to learn, plan, and invest — where AI meets real experts to help every Pakistani build wealth through ethical, Islamic finance
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard 
              icon={<Shield className="w-8 h-8" />}
              title="100% Safe Learning"
              description="Master investing without risking a single rupee through our simulation platform"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Islamic Finance"
              description="Halal investing options that align with your values and religious beliefs"
            />
            <FeatureCard 
              icon={<Award className="w-8 h-8" />}
              title="Urdu & English"
              description="Learn in your preferred language with culturally relevant examples"
            />
          </div>

          {/* CTA Section */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-blue-800/30">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Help Us Build Your Perfect Money App</h3>
            <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
              Your voice will directly shape the tools, lessons, and features we create. This quick 3-5 minute survey helps us understand exactly what you need.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Anonymous & Private</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>3-5 Minutes Only</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Early Access Available</span>
              </div>
            </div>

            <button
              onClick={onStartSurvey}
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <span>Start Survey</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-md border-t border-blue-800/30 py-6">
        <div className="container mx-auto px-4 text-center text-blue-200">
          <p>&copy; 2025 NafaVerse. Building Pakistan's financial future, one person at a time.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105">
      <div className="text-blue-400 mb-4 flex justify-center">{icon}</div>
      <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
      <p className="text-blue-100">{description}</p>
    </div>
  );
}

export default App;