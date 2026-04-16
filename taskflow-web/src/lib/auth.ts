import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  
  // Save accessToken to cookie (for middleware) and localStorage (fallback)
  if (typeof window !== 'undefined') {
    document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
    localStorage.setItem('accessToken', response.accessToken);
  }
  
  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  
  // Save accessToken to cookie (for middleware) and localStorage (fallback)
  if (typeof window !== 'undefined') {
    document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
    localStorage.setItem('accessToken', response.accessToken);
  }
  
  return response;
}

export async function logout(): Promise<void> {
  await api.post<void>('/auth/logout', {});
  
  // Clear both cookie and localStorage
  if (typeof window !== 'undefined') {
    document.cookie = 'accessToken=; path=/; max-age=0';
    localStorage.removeItem('accessToken');
  }
}

export async function getMe(): Promise<AuthResponse['user']> {
  const response = await api.get<{ user: AuthResponse['user'] }>('/auth/me');
  return response.user;
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/refresh', {});
  return response;
}
