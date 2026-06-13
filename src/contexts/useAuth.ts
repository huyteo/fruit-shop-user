import { useContext } from 'react';
import { AuthContext } from './authContextDef';
import type { AuthContextType } from './AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải dùng trong AuthProvider');
  }
  return context;
}