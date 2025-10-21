import axios from 'axios';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://nafaversebackend.onrender.com/api/',
      // baseURL: 'http://localhost:8080/api/',
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

    // Handle 401 globally
    this.api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          window.dispatchEvent(new Event('nafa-auth-unauthorized'));
        }
        return Promise.reject(error);
      }
    );
  }

  async signup(userDetails) {
    const res = await this.api.post('auth/signup', userDetails);
    return res.data;
  }

  async login(credentials) {
    const res = await this.api.post('auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      if (res.data.id || res.data.userId) {
        localStorage.setItem('userId', String(res.data.id ?? res.data.userId));
      }
      if (res.data.username) localStorage.setItem('username', String(res.data.username));
      if (res.data.email) localStorage.setItem('email', String(res.data.email));
    }
    return res.data;
  }

  googleLogin() {
    // Spring Security’s OAuth2 entrypoint
    window.location.href = 'https://nafaversebackend.onrender.com/oauth2/authorization/google';
    // window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  async requestPasswordReset(email) {
    const res = await this.api.post('password/request', null, { params: { email } });
    return res.data;
  }

  async resetPassword(token, newPassword) {
    const res = await this.api.post('password/reset', null, { params: { token, newPassword } });
    return res.data;
  }

  // GOALS: POST /api/goals/create
  async createGoalPlan(payload) {
    const token = localStorage.getItem('token');
    const res = await this.api.post('goals/create', payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log("goal response:", res.data);
    return res.data;
  }

  // SIMULATIONS: POST /api/simulations/create
  async createSimulationPlan(payload) {
    const token = localStorage.getItem('token');
    const res = await this.api.post('simulations/create', payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log("simulation response:", res.data);
    return res.data;
  }

  // Add this stub at the end of the class or after methods:
  async getMe() {
    // No network call; read from localStorage only
    return {
      id: localStorage.getItem('userId') || null,
      username: localStorage.getItem('username') || null,
      email: localStorage.getItem('email') || null,
    };
  }

  // submit contact feedback -> POST /api/contact-feedback/submit
  async submitContactFeedback(payload) {
    console.log(payload);
    
    const res = await this.api.post('contact-feedback/submit', payload);
    console.log("res "+ res.data);
    
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

// Handle Google OAuth callback: save ONLY to localStorage (no getMe)
export async function handleGoogleOAuthCallback() {
  const { pathname, search, hash } = window.location;
  const allowed = new Set(['/', '/auth/callback', '/oauth/callback']);
  if (!allowed.has(pathname)) return false;

  const qs = new URLSearchParams(search || '');
  const hs = new URLSearchParams((hash || '').replace(/^#/, ''));
  const get = (k) => qs.get(k) || hs.get(k);

  const token = get('token');
  if (!token) return false;

  localStorage.setItem('token', token);
  const id = get('id') || get('userId');
  const name = get('name') || get('username');
  const email = get('email');
  if (id) localStorage.setItem('userId', String(id));
  if (name) localStorage.setItem('username', String(name));
  if (email) localStorage.setItem('email', String(email));

  window.location.replace('/'); // hard redirects
  return true;
}

export const apiService = new ApiService();
