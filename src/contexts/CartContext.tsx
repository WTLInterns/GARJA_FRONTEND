'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '@/types/product';
import SuccessNotification from '@/components/SuccessNotification';
import { cartService, Cart as BackendCart } from '@/services/cartService';
import { productService } from '@/services/productService';
import { useAuth } from '@/contexts/AuthContext';

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
  | { type: 'HIDE_SUCCESS' }
  | { type: 'SET_TOTALS'; payload: { totalItems: number; totalAmount: number } };

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

    case 'SET_TOTALS': {
      const { totalItems, totalAmount } = action.payload;
      return {
        ...state,
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
  const { isAuthenticated } = useAuth();

  // Helper: transform backend cart to frontend items
  const mapBackendCartToFrontend = async (backendCart: BackendCart): Promise<CartItem[]> => {
    const items: CartItem[] = [];
    for (const bi of backendCart.items) {
      try {
        const prod = await productService.getProductById(String(bi.productId));
        const product: Product = prod || {
          id: String(bi.productId),
          name: bi.productName,
          price: parseFloat(String(bi.price).replace(/[^0-9.]/g, '')) || 0,
          originalPrice: undefined,
          description: '',
          category: 't-shirts',
          images: [bi.imageUrl],
          sizes: ['XS','M','L','XL','XXL'],
          colors: ['Black','White','Gray'],
          inStock: bi.isActive === 'true',
          stockQuantity: 0,
          rating: 4.5,
          reviewCount: 0,
          tags: [bi.category],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        items.push({
          id: `${bi.id}`,
          product,
          quantity: bi.quantity,
          selectedSize: bi.size || (product.sizes[0] || 'M'),
          selectedColor: product.colors[0] || 'Black',
          addedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Failed to map backend cart item:', bi, e);
      }
    }
    return items;
  };

  // Load cart from backend on mount/auth change
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        console.log('[Cart] User not authenticated; skipping backend cart load');
        dispatch({ type: 'LOAD_CART', payload: [] });
        return;
      }
      try {
        console.log('[Cart] Loading cart from backend...');
        const backend = await cartService.getCart();
        if (!backend) {
          console.log('[Cart] No cart found on backend');
          dispatch({ type: 'LOAD_CART', payload: [] });
          return;
        }
        const items = await mapBackendCartToFrontend(backend);
        dispatch({ type: 'LOAD_CART', payload: items });
        console.log('[Cart] Loaded cart:', backend);
      } catch (error) {
        console.error('[Cart] Error loading cart from backend:', error);
        dispatch({ type: 'LOAD_CART', payload: [] });
      }
    };
    loadCart();
  }, [isAuthenticated]);

  // Helper to refresh cart from backend after mutation
  const refreshCart = async () => {
    try {
      const backend = await cartService.getCart();
      if (backend) {
        const items = await mapBackendCartToFrontend(backend);
        dispatch({ type: 'LOAD_CART', payload: items });
      } else {
        dispatch({ type: 'LOAD_CART', payload: [] });
      }
    } catch (e) {
      console.error('[Cart] Failed to refresh cart:', e);
    }
  };

  const addItem = async (product: Product, quantity: number, selectedSize: string, selectedColor: string) => {
    try {
      console.log('[Cart] addItem →', { productId: product.id, quantity, selectedSize, selectedColor });
      const added = await cartService.addToCart(Number(product.id), quantity);
      console.log('[Cart] addItem response:', added);
      try {
        if (selectedSize) {
          const sized = await cartService.updateSize(Number(product.id), selectedSize);
          console.log('[Cart] updateSize response:', sized);
        }
      } catch (e) {
        console.warn('[Cart] updateSize failed or unsupported:', e);
      }
      await refreshCart();
      dispatch({ type: 'SHOW_SUCCESS', payload: `${product.name} added to cart successfully!` });
    } catch (e: any) {
      console.error('[Cart] addItem error:', e);
      dispatch({ type: 'SHOW_SUCCESS', payload: e.message || 'Failed to add to cart' });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 1500);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const item = state.items.find(i => i.id === id);
      if (!item) return;
      console.log('[Cart] removeItem →', { productId: item.product.id });
      const res = await cartService.removeFromCart(Number(item.product.id));
      console.log('[Cart] removeItem response:', res);
      await refreshCart();
    } catch (e) {
      console.error('[Cart] removeItem error:', e);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const item = state.items.find(i => i.id === id);
      if (!item) return;
      console.log('[Cart] updateQuantity →', { productId: item.product.id, quantity });
      const res = await cartService.updateQuantity(Number(item.product.id), quantity);
      console.log('[Cart] updateQuantity response:', res);
      await refreshCart();
    } catch (e) {
      console.error('[Cart] updateQuantity error:', e);
    }
  };

  const clearCart = async () => {
    try {
      console.log('[Cart] clearCart → calling API');
      const res = await cartService.clearCart();
      console.log('[Cart] clearCart response:', res);
      await refreshCart();
    } catch (e) {
      console.error('[Cart] clearCart error:', e);
    }
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
