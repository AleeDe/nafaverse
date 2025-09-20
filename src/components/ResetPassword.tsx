import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../api/apiService'; // Use named import
import { Toaster, toast } from 'sonner';

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing token.', { position: 'top-center' });
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.', { position: 'top-center' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.', { position: 'top-center' });
      return;
    }
    setLoading(true);
    try {
      await apiService.resetPassword(token, newPassword);
      toast.success('Password has been reset.', { position: 'top-center' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] px-4">
      <div className="w-full max-w-md nv-card rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h2>
        <p className="text-purple-100 mb-8 text-center">Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="nv-glow-btn w-full h-12 rounded-xl mt-2"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
