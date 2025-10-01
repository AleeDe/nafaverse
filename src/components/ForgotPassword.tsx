import React, { useEffect, useRef, useState } from 'react';
import { useDashboard } from './DashboardContext';
import { apiService } from '../api/apiService';
import { Toaster, toast } from 'sonner';
import { X, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const {
    currentLanguage,
    forgotPasswordModalOpen,
    setForgotPasswordModalOpen,
    setLoginModalOpen,
    setIsLoginMode
  } = useDashboard();

  // Hooks must always run in the same order on every render
  const [mode, setMode] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      title: 'Reset Your Password',
      subtitle: "Enter your email and we'll send you a link to get back into your account.",
      email: 'Email',
      sendLink: 'Send Reset Link',
      backToLogin: 'Back to Sign In',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter new password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter new password',
      resetPassword: 'Reset Password',
    },
    ur: {
      title: 'Apna Password Reset Karein',
      subtitle: 'Apna email darj karein aur hum aapko account mein wapas anay ke liye ek link bhejenge.',
      email: 'Email',
      sendLink: 'Reset Link Bhejein',
      backToLogin: 'Sign In par Wapas Jayein',
      newPassword: 'Naya Password',
      newPasswordPlaceholder: 'Naya password darj karein',
      confirmPassword: 'Password ki tasdeeq',
      confirmPasswordPlaceholder: 'Naya password dobara darj karein',
      resetPassword: 'Password Reset Karein',
    }
  } as const;

  const t = content[currentLanguage];

  // Effects must not be skipped by early returns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setForgotPasswordModalOpen(false);
      }
    };
    if (forgotPasswordModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [forgotPasswordModalOpen, setForgotPasswordModalOpen]);

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    setMode(qs.get('token') ? 'reset' : 'request');
  }, []);

  useEffect(() => {
    setLoginModalOpen?.(false);
    setIsLoginMode?.(true);
  }, [setLoginModalOpen, setIsLoginMode]);

  // After all hooks, you can short‑circuit render safely
  if (!forgotPasswordModalOpen) return null;

  const onRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await apiService.requestPasswordReset(email);
      toast.success(currentLanguage === 'ur' ? 'Password reset email bhej diya gaya hai.' : 'Password reset email sent.', { position: 'top-center' });
      setEmail('');
      setTimeout(handleClose, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send reset email');
      toast.error(currentLanguage === 'ur' ? 'Kuch masla hua. Dobara koshish karein.' : 'Something went wrong. Please try again.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (newPassword !== confirmPassword) throw new Error('Passwords do not match');
      const qs = new URLSearchParams(window.location.search);
      const token = qs.get('token') || '';
      await apiService.resetPassword(token, newPassword);
      toast.success(currentLanguage === 'ur' ? 'Password reset kar diya gaya hai.' : 'Password has been reset.', { position: 'top-center' });
      setNewPassword(''); setConfirmPassword('');
      setTimeout(handleClose, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to reset password');
      toast.error(currentLanguage === 'ur' ? 'Kuch masla hua. Dobara koshish karein.' : 'Something went wrong. Please try again.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setForgotPasswordModalOpen(false);

  const handleSwitchToLogin = () => {
    setForgotPasswordModalOpen(false);
    setIsLoginMode(true);
    setLoginModalOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div ref={modalRef} className="relative w-full max-w-md mx-auto animate-scaleIn">
        <div className="nv-card rounded-2xl overflow-hidden">
          <div className="nv-gradient-dark">
            <div className="p-6 border-b border-white/10 text-center">
              <h2 className="text-2xl font-bold text-white">{t.title}</h2>
              <p className="text-slate-300 mt-1 text-sm">{t.subtitle}</p>
              <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <div className="p-6">
              {mode === 'request' ? (
                <form onSubmit={onRequest} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">{t.email}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        ref={inputRef}
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                  <button type="submit" className="w-full nv-glow-btn text-lg font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-60" disabled={loading}>
                    {loading ? (currentLanguage === 'ur' ? 'Bhej rahe hain...' : 'Sending...') : t.sendLink}
                  </button>
                </form>
              ) : (
                <form onSubmit={onReset} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">{t.newPassword}</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t.newPasswordPlaceholder}
                      className="w-full border rounded px-3 py-2 mb-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">{t.confirmPassword}</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
                      className="w-full border rounded px-3 py-2 mb-3"
                      required
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                  <button type="submit" className="w-full nv-glow-btn text-lg font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-60" disabled={loading}>
                    {loading ? (currentLanguage === 'ur' ? 'Reset kar rahe hain...' : 'Resetting...') : t.resetPassword}
                  </button>
                </form>
              )}

              <div className="text-center mt-6">
                <button onClick={handleSwitchToLogin} className="text-sm text-purple-300 hover:text-purple-200 hover:underline">
                  {t.backToLogin}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
