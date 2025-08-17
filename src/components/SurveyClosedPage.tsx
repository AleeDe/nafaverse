import React from 'react';
import { Clock, Heart, Users, TrendingUp, CheckCircle, Mail } from 'lucide-react';

export default function SurveyClosedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-blue-800/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">NafaVerse</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-blue-800/30">
            {/* Icon */}
            <div className="text-blue-400 mb-6 flex justify-center">
              <Clock className="w-16 h-16" />
            </div>
            
            {/* Main Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Survey is Now Closed
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Thank you for your time and interest in helping us build NafaVerse!
            </p>

            {/* Stats/Impact Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-6 border border-blue-800/30">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Community Response</h3>
                <p className="text-blue-100 text-sm">
                  We received incredible feedback from our Pakistani community
                </p>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-6 border border-blue-800/30">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Your Impact</h3>
                <p className="text-blue-100 text-sm">
                  Every response helps us create better financial tools for Pakistan
                </p>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-6 border border-blue-800/30">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">What's Next</h3>
                <p className="text-blue-100 text-sm">
                  We're analyzing insights to build the perfect money app for you
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-6 mb-8 border border-blue-700/30">
              <h3 className="text-xl font-bold text-white mb-4">What Happens Now?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Analysis Phase</h4>
                    <p className="text-blue-100 text-sm">We're carefully analyzing every response to understand your needs</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Feature Development</h4>
                    <p className="text-blue-100 text-sm">Building the most requested tools and learning modules</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Early Access</h4>
                    <p className="text-blue-100 text-sm">Pilot program participants will get first access to NafaVerse</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Launch</h4>
                    <p className="text-blue-100 text-sm">Public launch with features you actually requested</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Connected */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-blue-800/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Stay Connected</span>
              </h3>
              <p className="text-blue-100 mb-4">
                Follow our journey as we build Pakistan's smartest finance platform
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:hello@nafaverse.com"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </a>
                <button className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                  Join Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-md border-t border-blue-800/30 py-6">
        <div className="container mx-auto px-4 text-center text-blue-200">
          <p>&copy; 2025 NafaVerse. Building Pakistan's financial future, one person at a time.</p>
        </div>
      </footer>
    </div>
  );
}