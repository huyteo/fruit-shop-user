import { useContext } from 'react';
import { CartContext } from './cartContextDef';
import type { CartContextType } from './CartContext';

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải dùng trong CartProvider');
  }
  return context;
}