import axios from 'axios';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://nafaversebackend.onrender.com/api/',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  async signup(userDetails) {
    const res = await this.api.post('auth/signup', userDetails);
    return res.data;
  }

  async login(credentials) {
    const res = await this.api.post('auth/login', credentials);
    if (res.data?.token) {
      const maxAge = 60 * 60 * 24 * 7;
      localStorage.setItem('token', res.data.token);
      document.cookie = `token=${res.data.token}; path=/; max-age=${maxAge}`;
      if (res.data.username) document.cookie = `username=${encodeURIComponent(res.data.username)}; path=/; max-age=${maxAge}`;
      if (res.data.email) document.cookie = `email=${encodeURIComponent(res.data.email)}; path=/; max-age=${maxAge}`;
    }
    return res.data;
  }

  // NEW: fetch current user using token
  async getMe() {
    const res = await this.api.get('auth/me'); // backend should return { username, email }
    return res.data;
  }

  googleLogin() {
    window.location.href = 'https://nafaversebackend.onrender.com/api/google/login';
  }

  async requestPasswordReset(email) {
    const res = await this.api.post('password/request', null, { params: { email } });
    return res.data;
  }

  async resetPassword(token, newPassword) {
    const res = await this.api.post('password/reset', null, { params: { token, newPassword } });
    return res.data;
  }
}

// Helper to decode JWT payload safely
function decodeJwt(token) {
  try {
    const payload = JSON.parse(atob((token || '').split('.')[1] || ''));
    return payload || null;
  } catch {
    return null;
  }
}

// Handle Google OAuth callback robustly
export async function handleGoogleOAuthCallback() {
  const { pathname, search } = window.location;

  // Do not run on password pages
  if (pathname === '/reset-password' || pathname === '/forgot-password') return false;

  // Only handle on these paths
  const allowed = ['/', '/auth/callback', '/oauth/callback'];
  if (!allowed.includes(pathname)) return false;

  const params = new URLSearchParams(search);
  const token = params.get('token');
  if (!token) return false;

  const maxAge = 60 * 60 * 24 * 7;
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=${maxAge}`;

  // Try URL user info
  const urlUsername = params.get('username');
  const urlEmail = params.get('email');
  if (urlUsername) document.cookie = `username=${encodeURIComponent(urlUsername)}; path=/; max-age=${maxAge}`;
  if (urlEmail) document.cookie = `email=${encodeURIComponent(urlEmail)}; path=/; max-age=${maxAge}`;

  // Fallback: decode JWT
  if (!urlUsername && !urlEmail) {
    const payload = decodeJwt(token);
    const nameFromJwt = payload?.username || payload?.name || payload?.preferred_username;
    const emailFromJwt = payload?.email;
    if (nameFromJwt) document.cookie = `username=${encodeURIComponent(nameFromJwt)}; path=/; max-age=${maxAge}`;
    if (emailFromJwt) document.cookie = `email=${encodeURIComponent(emailFromJwt)}; path=/; max-age=${maxAge}`;
  }

  // Clean URL and notify app
  window.history.replaceState({}, document.title, '/');
  window.dispatchEvent(new Event('nafa-auth-updated'));
  return true;
}

export const apiService = new ApiService();
