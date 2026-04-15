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
  
  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  
  // Store accessToken in cookie
  document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
  
  return response;
}

export async function logout(): Promise<void> {
  await api.post<void>('/auth/logout', {});
  
  // Remove accessToken cookie
  document.cookie = 'accessToken=; path=/; max-age=0';
}

export async function getMe(): Promise<AuthResponse['user']> {
  const user = await api.get<AuthResponse['user']>('/auth/me');
  return user;
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/refresh', {});
  return response;
}
