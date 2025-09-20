import React from 'react';
import { useDashboard } from '../components/DashboardContext';

export function AccountPage() {
  const { user, logout } = useDashboard();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p className="mb-6">Welcome, {user?.username || user?.email || 'User'}!</p>
      <button
        onClick={logout}
        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
      >
        Logout
      </button>
    </div>
  );
}