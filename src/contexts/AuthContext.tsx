import { useState } from 'react';
import type { ReactNode } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from './authContextDef';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

function getInitialUser(): User | null {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('accessToken');
  if (savedUser && token) {
    return JSON.parse(savedUser) as User;
  }
  return null;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { user: userData, accessToken } = response.data;

      // Chỉ cho phép tài khoản role "customer" đăng nhập vào web người dùng
      if (userData.role !== 'customer') {
        throw new Error('Tài khoản này không phải tài khoản khách hàng');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err: unknown) {
      // Giữ nguyên lỗi sai role mình tự ném
      if (err instanceof Error && err.message.includes('không phải tài khoản khách hàng')) {
        throw err;
      }
      // Lỗi từ API (sai email/mật khẩu) → lấy message tiếng Việt từ backend
      const e = err as { response?: { data?: { message?: string } } };
      throw new Error(e.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await axiosClient.post('/auth/register', data);
    const { user: userData, accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}