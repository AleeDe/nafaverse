import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../components/DashboardContext';
import { apiService } from '../api/apiService';
import { Toaster, toast } from 'sonner';

export const ForgotPasswordPage = () => {
  const { currentLanguage } = useDashboard();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const content = {
    en: {
      title: 'Forgot Your Password?',
      description: "Enter your email and we'll send you a link to reset your password.",
      emailLabel: 'Email Address',
      buttonText: 'Send Reset Link',
      success: 'Password reset email sent successfully!',
      error: 'Failed to send reset email. Please try again.',
      backToLogin: 'Back to Login'
    },
    ur: {
      title: 'پاس ورڈ بھول گئے؟',
      description: 'اپنا ای میل درج کریں اور ہم آپ کو پاس ورڈ ری سیٹ کرنے کے لیے ایک لنک بھیجیں گے۔',
      emailLabel: 'ای میل ایڈریس',
      buttonText: 'ری سیٹ لنک بھیجیں',
      success: 'پاس ورڈ ری سیٹ ای میل کامیابی کے ساتھ بھیج دی گئی ہے!',
      error: 'ری سیٹ ای میل بھیجنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں.',
      backToLogin: 'لاگ ان پر واپس'
    }
  };

  const t = content[currentLanguage];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.requestPasswordReset(email);
      toast.success(t.success);
      setTimeout(() => navigate('/'), 2000); // Redirect to home after 2 seconds
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81]">
      <div className="absolute inset-0 opacity-15">
              <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6] rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F59E0B] rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B5CF6]/50 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
      <Toaster position="top-center" richColors />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">{t.title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{t.description}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : t.buttonText}
          </button>
        </form>
        <div className="text-center mt-4">
            <button onClick={() => navigate('/')} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                {t.backToLogin}
            </button>
        </div>
      </div>
    </div>
  );
};