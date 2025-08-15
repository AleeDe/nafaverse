import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Send, Loader2 } from 'lucide-react';
import { submitToGoogleSheets } from '../utils/googleSheets';

interface SurveyData {
  name?: string;
  ageGroup: string;
  gender: string;
  income: string;
  saveMethod: string;
  trackExpenses: string;
  noTrackingReason: string[];
  financialDecision: string;
  investmentHistory: string;
  investmentExperience: string;
  investmentBarriers: string[];
  interestTopics: string[];
  learningPreference: string;
  scenarioMoney: string;
  scenarioFriend: string;
  desiredTool: string;
  pilotInterest: string;
  contact?: string;
}

const STEPS = [
  { id: 1, title: 'Basic Profile', questions: 4 },
  { id: 2, title: 'Money Habits', questions: 4 },
  { id: 3, title: 'Investments', questions: 3 },
  { id: 4, title: 'Learning', questions: 2 },
  { id: 5, title: 'Scenarios', questions: 2 },
  { id: 6, title: 'Final Thoughts', questions: 2 }
];

export default function SurveyForm({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [data, setData] = useState<SurveyData>({
    ageGroup: '',
    gender: '',
    income: '',
    saveMethod: '',
    trackExpenses: '',
    noTrackingReason: [],
    financialDecision: '',
    investmentHistory: '',
    investmentExperience: '',
    investmentBarriers: [],
    interestTopics: [],
    learningPreference: '',
    scenarioMoney: '',
    scenarioFriend: '',
    desiredTool: '',
    pilotInterest: ''
  });

  const updateData = (key: keyof SurveyData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (key: keyof SurveyData, value: string) => {
    const currentArray = data[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateData(key, newArray);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.ageGroup && data.gender && data.income;
      case 2:
        return data.trackExpenses && data.financialDecision && 
               (data.income !== 'No income right now' ? data.saveMethod : true) &&
               (data.trackExpenses === 'No' ? data.noTrackingReason.length > 0 : true);
      case 3:
        return data.investmentHistory && 
               (['Yes, currently investing', 'Yes, but stopped'].includes(data.investmentHistory) ? data.investmentExperience : true) &&
               (['Yes, but haven\'t started recently', 'No, never invested'].includes(data.investmentHistory) ? data.investmentBarriers.length > 0 : true);
      case 4:
        return data.interestTopics.length > 0 && data.learningPreference;
      case 5:
        return data.scenarioMoney && data.scenarioFriend;
      case 6:
        return data.desiredTool && data.pilotInterest;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting survey data:', data); 
      await submitToGoogleSheets(data);
      setIsComplete(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return <ThankYouPage onBack={onBack} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-white">NafaVerse Survey</h1>
              <span className="text-blue-300">Step {currentStep} of {STEPS.length}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`text-xs ${currentStep >= step.id ? 'text-blue-300' : 'text-slate-500'}`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Survey Content */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-blue-800/30">
          {currentStep === 1 && <Step1 data={data} updateData={updateData} />}
          {currentStep === 2 && <Step2 data={data} updateData={updateData} handleMultiSelect={handleMultiSelect} />}
          {currentStep === 3 && <Step3 data={data} updateData={updateData} handleMultiSelect={handleMultiSelect} />}
          {currentStep === 4 && <Step4 data={data} updateData={updateData} handleMultiSelect={handleMultiSelect} />}
          {currentStep === 5 && <Step5 data={data} updateData={updateData} />}
          {currentStep === 6 && <Step6 data={data} updateData={updateData} />}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep === STEPS.length ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Survey'}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(STEPS.length, currentStep + 1))}
                disabled={!canProceed()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function Step1({ data, updateData }: { data: SurveyData, updateData: (key: keyof SurveyData, value: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Section 1 – Basic Profile</h2>
      
      <div>
        <label className="block text-white font-medium mb-3">Name (Optional)</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => updateData('name', e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-white font-medium mb-3">Age Group *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Under 18', '18–25', '26–35', '36–45', '46+'].map((option) => (
            <button
              key={option}
              onClick={() => updateData('ageGroup', option)}
              className={`p-3 rounded-xl border transition-all ${
                data.ageGroup === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-3">Gender *</label>
        <div className="grid grid-cols-3 gap-3">
          {['Female', 'Male', 'Prefer not to say'].map((option) => (
            <button
              key={option}
              onClick={() => updateData('gender', option)}
              className={`p-3 rounded-xl border transition-all ${
                data.gender === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-3">Do you currently earn an income? *</label>
        <div className="space-y-3">
          {['Yes, regular monthly income', 'Yes, but irregular/freelance income', 'No income right now'].map((option) => (
            <button
              key={option}
              onClick={() => updateData('income', option)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                data.income === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ data, updateData, handleMultiSelect }: { 
  data: SurveyData, 
  updateData: (key: keyof SurveyData, value: any) => void,
  handleMultiSelect: (key: keyof SurveyData, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Section 2 – Money Habits</h2>
      
      {data.income !== 'No income right now' && (
        <div>
          <label className="block text-white font-medium mb-3">How do you prefer to save money? *</label>
          <div className="space-y-3">
            {['Bank account', 'Cash at home', 'Committees/chit funds', 'Investments (stocks, property, gold)'].map((option) => (
              <button
                key={option}
                onClick={() => updateData('saveMethod', option)}
                className={`w-full p-3 rounded-xl border transition-all text-left ${
                  data.saveMethod === option
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-white font-medium mb-3">Do you currently track your income and expenses? *</label>
        <div className="grid grid-cols-2 gap-3">
          {['Yes', 'No'].map((option) => (
            <button
              key={option}
              onClick={() => updateData('trackExpenses', option)}
              className={`p-3 rounded-xl border transition-all ${
                data.trackExpenses === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option === 'Yes' ? '✅ Yes' : '❌ No'}
            </button>
          ))}
        </div>
      </div>

      {data.trackExpenses === 'No' && (
        <div>
          <label className="block text-white font-medium mb-3">Why don't you track your money yet? (Select all that apply) *</label>
          <div className="space-y-3">
            {[
              "I don't know how to start",
              "I feel it's too time-consuming",
              "I don't see the need",
              "I tried before but couldn't keep up"
            ].map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('noTrackingReason', option)}
                className={`w-full p-3 rounded-xl border transition-all text-left ${
                  data.noTrackingReason.includes(option)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
                }`}
              >
                {data.noTrackingReason.includes(option) && <CheckCircle className="w-4 h-4 inline mr-2" />}
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-white font-medium mb-3">Who is mainly responsible for financial decisions in your household? *</label>
        <div className="space-y-3">
          {['Me', 'Shared equally', 'Someone else decides'].map((option) => (
            <button
              key={option}
              onClick={() => updateData('financialDecision', option)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                data.financialDecision === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ data, updateData, handleMultiSelect }: { 
  data: SurveyData, 
  updateData: (key: keyof SurveyData, value: any) => void,
  handleMultiSelect: (key: keyof SurveyData, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Section 3 – Investments & Barriers</h2>
      
      <div>
        <label className="block text-white font-medium mb-3">Have you ever invested your money before? *</label>
        <div className="space-y-3">
          {[
            'Yes, currently investing',
            'Yes, but stopped',
            'Yes, but haven\'t started recently',
            'No, never invested'
          ].map((option) => (
            <button
              key={option}
              onClick={() => updateData('investmentHistory', option)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                data.investmentHistory === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {['Yes, currently investing', 'Yes, but stopped'].includes(data.investmentHistory) && (
        <div>
          <label className="block text-white font-medium mb-3">What type of investment was it and how was your experience?</label>
          <textarea
            value={data.investmentExperience}
            onChange={(e) => updateData('investmentExperience', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors h-24 resize-none"
            placeholder="Tell us about your investment experience..."
          />
        </div>
      )}

      {['Yes, but haven\'t started recently', 'No, never invested'].includes(data.investmentHistory) && (
        <div>
          <label className="block text-white font-medium mb-3">What's the main reason you haven't invested yet? (Select all that apply) *</label>
          <div className="space-y-3">
            {[
              'Lack of knowledge',
              'Not enough money to start',
              'Fear of scams or losing money',
              'No trusted source of advice'
            ].map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('investmentBarriers', option)}
                className={`w-full p-3 rounded-xl border transition-all text-left ${
                  data.investmentBarriers.includes(option)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
                }`}
              >
                {data.investmentBarriers.includes(option) && <CheckCircle className="w-4 h-4 inline mr-2" />}
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Step4({ data, updateData, handleMultiSelect }: { 
  data: SurveyData, 
  updateData: (key: keyof SurveyData, value: any) => void,
  handleMultiSelect: (key: keyof SurveyData, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Section 4 – Learning & Confidence</h2>
      
      <div>
        <label className="block text-white font-medium mb-3">Which financial topics interest you the most? (Select all that apply) *</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Saving strategies',
            'Budgeting',
            'Investments',
            'Loans & debt management',
            'Retirement planning',
            'Business finance',
            'Women-focused financial education',
            'Islamic finance & Halal investing'
          ].map((option) => (
            <button
              key={option}
              onClick={() => handleMultiSelect('interestTopics', option)}
              className={`p-3 rounded-xl border transition-all text-left ${
                data.interestTopics.includes(option)
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {data.interestTopics.includes(option) && <CheckCircle className="w-4 h-4 inline mr-2" />}
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-3">How do you prefer learning about money? *</label>
        <div className="space-y-3">
          {[
            'Short videos',
            'Step-by-step guides',
            'Interactive activities/quizzes',
            'Live workshops'
          ].map((option) => (
            <button
              key={option}
              onClick={() => updateData('learningPreference', option)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                data.learningPreference === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step5({ data, updateData }: { data: SurveyData, updateData: (key: keyof SurveyData, value: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Section 5 – Scenario-Based Thinking</h2>
      
      <div>
        <label className="block text-white font-medium mb-3">
          Imagine this: You earn 40,000 PKR/month. Rent is 15,000 PKR and expenses are 12,000 PKR. 
          You have 13,000 PKR left. What would you do with the remaining amount? *
        </label>
        <div className="space-y-3">
          {[
            'Save all of it',
            'Spend on something I want',
            'Save part and spend part',
            'Invest it',
            'Other'
          ].map((option) => (
            <button
              key={option}
              onClick={() => updateData('scenarioMoney', option)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                data.scenarioMoney === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-3">
          A friend promises to double your money in one month if you invest with them. What would you do? *
        </label>
        <div className="space-y-3">
          {[
            'Invest immediately — sounds good',
            'Ask more questions and verify',
            'Decline — too risky',
            'Not sure'
          ].map((option) => (
            <button
              key={option}
              onClick={() => updateData('scenarioFriend', option)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                data.scenarioFriend === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step6({ data, updateData }: { data: SurveyData, updateData: (key: keyof SurveyData, value: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Section 6 – Wrap-Up</h2>
      
      <div>
        <label className="block text-white font-medium mb-3">
          If NafaVerse could create ONE tool or lesson to help you with money, what should it be? *
        </label>
        <textarea
          value={data.desiredTool}
          onChange={(e) => updateData('desiredTool', e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors h-24 resize-none"
          placeholder="Tell us about the most important tool or lesson you need..."
        />
      </div>

      <div>
        <label className="block text-white font-medium mb-3">Would you like to join our pilot program or be contacted for follow-up? *</label>
        <div className="grid grid-cols-2 gap-3">
          {['Yes', 'No'].map((option) => (
            <button
              key={option}
              onClick={() => updateData('pilotInterest', option)}
              className={`p-3 rounded-xl border transition-all ${
                data.pilotInterest === option
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {data.pilotInterest === 'Yes' && (
        <div>
          <label className="block text-white font-medium mb-3">Contact Information (Email or Phone)</label>
          <input
            type="text"
            value={data.contact || ''}
            onChange={(e) => updateData('contact', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            placeholder="your.email@example.com or +92XXXXXXXXXX"
          />
        </div>
      )}
    </div>
  );
}

function ThankYouPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-blue-800/30">
          <div className="text-green-400 mb-6 flex justify-center">
            <CheckCircle className="w-16 h-16" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-xl text-blue-100 mb-6">
            Your responses have been successfully submitted and will help us build the perfect financial platform for Pakistan.
          </p>
          
          <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">What's Next?</h3>
            <ul className="text-blue-100 space-y-2 text-left">
              <li>• We'll analyze your feedback along with others</li>
              <li>• Development will prioritize the most requested features</li>
              <li>• Early access notifications will be sent to interested users</li>
              <li>• NafaVerse will launch with features you actually need</li>
            </ul>
          </div>
          
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}