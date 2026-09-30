import { apiClient } from './api';

export const authService = {
  async login(payload: any) {
    const res = await apiClient<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ username: payload.username }));
    }
    return res;
  },
  async register(payload: any) {
    return apiClient<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
