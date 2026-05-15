import api from './axios';
import BASE_URL from './config';
import type { LoginPayload, RegisterPayload, AuthResponse, User } from '../types';

const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(`${BASE_URL}/auth/login`, payload);
    localStorage.setItem('ach_token', data.token); // Save token
    localStorage.setItem('ach_user', JSON.stringify(data.user)); // Save user
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(`${BASE_URL}/auth/register`, payload);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<{ data: User }>(`${BASE_URL}/auth/profile`);
    return data.data;
  },
};

export default authService;
