import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../api/apiService';
import { useDashboard } from './DashboardContext';
import { Toaster, toast } from 'sonner';

export const LoginModal: React.FC = () => {
  const {
    currentLanguage,
    loginModalOpen,
    setLoginModalOpen,
    isLoginMode,
    setIsLoginMode,
    setForgotPasswordModalOpen,
    refreshAuthFromStorage
  } = useDashboard();

  const [showPassword, setShowPassword] = useState(false);
  const initialForm = { username: '', email: '', password: '', confirmPassword: '' };
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const content = {
    en: {
      loginTitle: 'Welcome back to NafaVerse',
      signupTitle: 'Join NafaVerse Today',
      loginSubtitle: 'Continue your financial literacy journey',
      signupSubtitle: 'Start your journey to financial independence',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      loginButton: 'Sign In',
      signupButton: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signupLink: 'Sign Up',
      loginLink: 'Sign In',
      orContinue: 'Or continue with',
      google: 'Continue with Google',
      facebook: 'Continue with Facebook',
      apple: 'Continue with Apple'
    },
    ur: {
      loginTitle: 'Dobara NafaVerse par aao',
      signupTitle: 'Aaj hi NafaVerse join karo',
      loginSubtitle: 'Apna financial literacy safar jari rakho',
      signupSubtitle: 'Financial independence ka safar yahin se start',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Password confirm',
      forgotPassword: 'Password bhool gaye?',
      loginButton: 'Sign In',
      signupButton: 'Account banao',
      noAccount: 'Account nahi hai?',
      hasAccount: 'Already account bana hua hai?',
      signupLink: 'Sign Up',
      loginLink: 'Sign In',
      orContinue: 'Ya in ke saath continue karo',
      google: 'Google se continue',
      facebook: 'Facebook se continue',
      apple: 'Apple se continue'
    }
  } as const;

  const t = content[currentLanguage] || content.en;

  if (!loginModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginMode) {
        await apiService.login({ email: formData.email, password: formData.password });
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await apiService.signup({ username: formData.username, email: formData.email, password: formData.password });
      }
      refreshAuthFromStorage();
      toast.success('Success!', { position: 'top-center' });
      setTimeout(() => {
        setLoginModalOpen(false);
        setFormData(initialForm);
        setShowPassword(false);
      }, 1200);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error('Invalid email or password.', { position: 'top-center' });
      } else if (err?.response?.status === 409) {
        toast.error(err.response.data?.error || 'Email or username already exists.', { position: 'top-center' });
      } else if (err?.response?.status === 500) {
        toast.error('Server error. Try again later.', { position: 'top-center' });
      } else {
        toast.error('Request failed. Please try again.', { position: 'top-center' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setLoginModalOpen(false);
    setForgotPasswordModalOpen(true);
  };

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData(initialForm);
    setShowPassword(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="relative w-full max-w-md mx-auto">
        <div className="nv-card rounded-2xl overflow-hidden">
          <div className="nv-gradient-dark">
            {/* Header */}
            <div className="p-6 border-b border-white/10 text-center">
              <h2 className="text-2xl font-bold text-white">
                {isLoginMode ? t.loginTitle : t.signupTitle}
              </h2>
              <p className="text-slate-300 mt-1">
                {isLoginMode ? t.loginSubtitle : t.signupSubtitle}
              </p>
              <button
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {!isLoginMode && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      {t.confirmPassword}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {isLoginMode && (
                  <div className="flex items-center justify-end">
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="font-medium text-purple-400 hover:text-purple-300"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  className="nv-glow-btn w-full h-12 rounded-xl"
                  disabled={loading}
                >
                  {loading ? (isLoginMode ? 'Signing in...' : 'Creating...') : (isLoginMode ? t.loginButton : t.signupButton)}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-slate-400">
                      {t.orContinue}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    className="w-full flex items-center justify-center px-4 h-11 rounded-xl bg-white/90 hover:bg-white text-slate-900 transition-colors"
                    type="button"
                    onClick={() => {
                      setLoginModalOpen(false); // optional: hide before redirect
                      apiService.googleLogin(); // redirects; no .then()
                    }}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium">{t.google}</span>
                  </button>
                  <button className="w-full flex items-center justify-center px-4 h-11 rounded-xl bg-[#1877F2] hover:brightness-110 text-white transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="font-medium">{t.facebook}</span>
                  </button>
                  <button className="w-full flex items-center justify-center px-4 h-11 rounded-xl bg-white/90 hover:bg-white text-slate-900 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="#000000" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                    </svg>
                    <span className="font-medium">{t.apple}</span>
                  </button>
                </div>
              </div>

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center">
                <p className="text-slate-300">
                  {isLoginMode ? t.noAccount : t.hasAccount}{' '}
                  <button
                    onClick={handleToggleMode}
                    className="text-purple-300 hover:text-purple-200 font-medium"
                  >
                    {isLoginMode ? t.signupLink : t.loginLink}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};