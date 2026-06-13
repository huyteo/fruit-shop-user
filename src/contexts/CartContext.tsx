import { useState } from 'react';
import type { ReactNode } from 'react';
import { CartContext } from './cartContextDef';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  thumbnail: string;
  unit: string;
  quantity: number;
  stock: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

function getInitialCart(): CartItem[] {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    return JSON.parse(savedCart) as CartItem[];
  }
  return [];
}

function saveCart(items: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(items));
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);

  const addToCart = (product: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.productId,
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        newItems = prev.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + product.quantity }
            : item,
        );
      } else {
        newItems = [...prev, product];
      }

      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.productId !== productId);
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}