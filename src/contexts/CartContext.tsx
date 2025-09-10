'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '@/types/product';
import SuccessNotification from '@/components/SuccessNotification';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalAmount: number;
  showSuccessNotification: boolean;
  successMessage: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selectedSize: string; selectedColor: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SHOW_SUCCESS'; payload: string }
  | { type: 'HIDE_SUCCESS' };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number, selectedSize: string, selectedColor: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  showSuccessNotification: (message: string) => void;
  hideSuccessNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedSize, selectedColor } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
          product,
          quantity,
          selectedSize,
          selectedColor,
          addedAt: new Date().toISOString(),
        };
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        showSuccessNotification: true,
        successMessage: `${product.name} added to cart successfully!`,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };

    case 'LOAD_CART': {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return {
        ...state,
        items,
        totalItems,
        totalAmount,
      };
    }

    case 'SHOW_SUCCESS':
      return {
        ...state,
        showSuccessNotification: true,
        successMessage: action.payload,
      };

    case 'HIDE_SUCCESS':
      return {
        ...state,
        showSuccessNotification: false,
        successMessage: '',
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalAmount: 0,
  showSuccessNotification: false,
  successMessage: '',
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('garja-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('garja-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, quantity: number, selectedSize: string, selectedColor: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedSize, selectedColor } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const showSuccessNotification = (message: string) => {
    dispatch({ type: 'SHOW_SUCCESS', payload: message });
  };

  const hideSuccessNotification = () => {
    dispatch({ type: 'HIDE_SUCCESS' });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        showSuccessNotification,
        hideSuccessNotification,
      }}
    >
      {children}
      <SuccessNotification
        message={state.successMessage}
        isVisible={state.showSuccessNotification}
        onClose={hideSuccessNotification}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
