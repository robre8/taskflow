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
  
  // Store accessToken in cookie
  document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
  // Store refreshToken in cookie
  document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}`;
  
  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  
  // Store accessToken in cookie
  document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
  // Store refreshToken in cookie
  document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}`;
  
  return response;
}

export async function logout(): Promise<void> {
  // Read refreshToken from cookies
  let refreshToken: string | undefined;
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    refreshToken = cookies.refreshToken;
  }

  await api.post<void>('/auth/logout', { refreshToken });
  
  // Remove accessToken and refreshToken cookies
  document.cookie = 'accessToken=; path=/; max-age=0';
  document.cookie = 'refreshToken=; path=/; max-age=0';
}

export async function getMe(): Promise<AuthResponse['user']> {
  const response = await api.get<{ user: AuthResponse['user'] }>('/auth/me');
  return response.user;
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/refresh', {});
  return response;
}
