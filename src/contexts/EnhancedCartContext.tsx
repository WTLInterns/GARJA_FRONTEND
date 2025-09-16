'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import SuccessNotification from '@/components/SuccessNotification';
import { cartService, Cart as BackendCart, CartItem as BackendCartItem } from '@/services/cartService';
import { useAuth } from '@/contexts/AuthContext';

// Enhanced CartItem interface that works with backend
interface CartItem {
  id: string;
  productId: number;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  lineTotal: number;
  addedAt: string;
}






interface CartState {
  items: CartItem[];
  backendCart: BackendCart | null;
  isOpen: boolean;
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  isSyncing: boolean;
  showSuccessNotification: boolean;
  successMessage: string;
  error: string | null;
}

type CartAction =
  | { type: 'SET_BACKEND_CART'; payload: BackendCart }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM_SUCCESS'; payload: { cart: BackendCart; message: string } }
  | { type: 'REMOVE_ITEM_SUCCESS'; payload: BackendCart }
  | { type: 'UPDATE_QUANTITY_SUCCESS'; payload: BackendCart }
  | { type: 'UPDATE_SIZE_SUCCESS'; payload: BackendCart }
  | { type: 'CLEAR_CART_SUCCESS' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SHOW_SUCCESS'; payload: string }
  | { type: 'HIDE_SUCCESS' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOCAL_ADD_ITEM'; payload: CartItem }
  | { type: 'LOCAL_REMOVE_ITEM'; payload: string }
  | { type: 'LOCAL_UPDATE_QUANTITY'; payload: { id: string; quantity: number } };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number, selectedSize: string, selectedColor: string) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  updateSize: (productId: number, size: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartItemByProductId: (productId: number) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to convert backend cart to frontend format
const convertBackendCartToItems = (backendCart: BackendCart): CartItem[] => {
  return backendCart.items.map(item => ({
    id: `${item.productId}-${item.size}-${Date.now()}`,
    productId: item.productId,
    product: {
      id: item.productId.toString(),
      name: item.productName,
      price: parseFloat(item.price),
      originalPrice: parseFloat(item.price) * 1.2, // Assuming 20% discount
      description: '',
      category: ((c: string) => {
        const allowed = ['t-shirts','hoodies','shirts','jackets','pants','jeans','shorts','sweaters'] as const;
        return (allowed as readonly string[]).includes(c) ? (c as typeof allowed[number]) : 't-shirts';
      })(item.category),
      images: [item.imageUrl],
      sizes: [item.size],
      colors: ['Default'],
      rating: 4.5,
      reviewCount: 0,
      inStock: item.isActive === 'true',
      stockQuantity: 100,
      tags: [] as string[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Product,
    quantity: item.quantity,
    selectedSize: item.size,
    selectedColor: 'Default', 
    lineTotal: item.lineTotal, 
    addedAt: new Date().toISOString()
  }));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_BACKEND_CART': {
      const backendCart = action.payload;
      const items = convertBackendCartToItems(backendCart);
      return {
        ...state,
        backendCart,
        items,
        totalItems: backendCart.totalItems,
        totalAmount: backendCart.totalAmount,
        isLoading: false,
        isSyncing: false
      };
    }

    case 'SET_ITEMS': {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);
      return {
        ...state,
        items,
        totalItems,
        totalAmount
      };
    }

    case 'ADD_ITEM_SUCCESS': {
      const { cart, message } = action.payload;
      const items = convertBackendCartToItems(cart);
      return {
        ...state,
        backendCart: cart,
        items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        showSuccessNotification: true,
        successMessage: message,
        isSyncing: false
      };
    }

    case 'REMOVE_ITEM_SUCCESS': {
      const cart = action.payload;
      const items = convertBackendCartToItems(cart);
      return {
        ...state,
        backendCart: cart,
        items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        isSyncing: false
      };
    }

    case 'UPDATE_QUANTITY_SUCCESS': {
      const cart = action.payload;
      const items = convertBackendCartToItems(cart);
      return {
        ...state,
        backendCart: cart,
        items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        isSyncing: false
      };
    }

    case 'UPDATE_SIZE_SUCCESS': {
      const cart = action.payload;
      const items = convertBackendCartToItems(cart);
      return {
        ...state,
        backendCart: cart,
        items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        isSyncing: false
      };
    }

    case 'CLEAR_CART_SUCCESS':
      return {
        ...state,
        backendCart: null,
        items: [],
        totalItems: 0,
        totalAmount: 0,
        isSyncing: false,
        showSuccessNotification: true,
        successMessage: 'Cart cleared successfully!'
      };

    case 'LOCAL_ADD_ITEM': {
      const newItem = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.productId === newItem.productId && 
                item.selectedSize === newItem.selectedSize
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity, lineTotal: item.lineTotal + newItem.lineTotal }
            : item
        );
      } else {
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.lineTotal, 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        showSuccessNotification: true,
        successMessage: `${newItem.product.name} added to cart!`
      };
    }

    case 'LOCAL_REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.lineTotal, 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount
      };
    }

    case 'LOCAL_UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'LOCAL_REMOVE_ITEM', payload: id });
      }

      const newItems = state.items.map(item => {
        if (item.id === id) {
          const unitPrice = item.lineTotal / item.quantity;
          return { 
            ...item, 
            quantity,
            lineTotal: unitPrice * quantity
          };
        }
        return item;
      });

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.lineTotal, 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount
      };
    }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };

    case 'SHOW_SUCCESS':
      return {
        ...state,
        showSuccessNotification: true,
        successMessage: action.payload
      };

    case 'HIDE_SUCCESS':
      return {
        ...state,
        showSuccessNotification: false,
        successMessage: ''
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  backendCart: null,
  isOpen: false,
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  isSyncing: false,
  showSuccessNotification: false,
  successMessage: '',
  error: null
};

export const EnhancedCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Sync cart with backend when user logs in
  const syncCart = useCallback(async () => {
    if (!user) {
      // Clear backend cart reference when logged out
      dispatch({ type: 'SET_ITEMS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await cartService.getCart();
      if (cart) {
        dispatch({ type: 'SET_BACKEND_CART', payload: cart });
      } else {
        dispatch({ type: 'SET_ITEMS', payload: [] });
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart' });
      
      // Load from localStorage as fallback
      const savedCart = localStorage.getItem('garja-cart-items');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          dispatch({ type: 'SET_ITEMS', payload: items });
        } catch (e) {
          console.error('Error parsing saved cart:', e);
        }
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  // Load cart on mount and when user changes
  useEffect(() => {
    syncCart();
  }, [user, syncCart]);

  // Save cart items to localStorage for offline support
  useEffect(() => {
    if (!state.isLoading && state.items.length > 0) {
      localStorage.setItem('garja-cart-items', JSON.stringify(state.items));
    }
  }, [state.items, state.isLoading]);

  const addItem = async (product: Product, quantity: number, selectedSize: string, selectedColor: string) => {
    // If user is not logged in, add to local cart only
    if (!user) {
      const newItem: CartItem = {
        id: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
        productId: parseInt(product.id),
        product,
        quantity,
        selectedSize,
        selectedColor,
        lineTotal: product.price * quantity,
        addedAt: new Date().toISOString()
      };
      dispatch({ type: 'LOCAL_ADD_ITEM', payload: newItem });
      return;
    }

    // Sync with backend
    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      const updatedCart = await cartService.addToCart(parseInt(product.id), quantity);
      dispatch({ 
        type: 'ADD_ITEM_SUCCESS', 
        payload: { 
          cart: updatedCart, 
          message: `${product.name} added to cart!` 
        } 
      });
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SHOW_SUCCESS', payload: 'Failed to add item to cart' });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const removeItem = async (productId: number) => {
    if (!user) {
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        dispatch({ type: 'LOCAL_REMOVE_ITEM', payload: item.id });
      }
      return;
    }

    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: updatedCart });
    } catch (error: any) {
      console.error('Error removing item:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) {
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        dispatch({ type: 'LOCAL_UPDATE_QUANTITY', payload: { id: item.id, quantity } });
      }
      return;
    }

    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      dispatch({ type: 'UPDATE_QUANTITY_SUCCESS', payload: updatedCart });
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const updateSize = async (productId: number, size: string) => {
    if (!user) {
      // For local cart, we'd need to handle this differently
      dispatch({ type: 'SHOW_SUCCESS', payload: 'Please login to update size' });
      return;
    }

    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      const updatedCart = await cartService.updateSize(productId, size);
      dispatch({ type: 'UPDATE_SIZE_SUCCESS', payload: updatedCart });
    } catch (error: any) {
      console.error('Error updating size:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const clearCart = async () => {
    if (!user) {
      dispatch({ type: 'CLEAR_CART_SUCCESS' });
      localStorage.removeItem('garja-cart-items');
      return;
    }

    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART_SUCCESS' });
      localStorage.removeItem('garja-cart-items');
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const getCartItemByProductId = (productId: number): CartItem | undefined => {
    return state.items.find(item => item.productId === productId);
  };

  const hideSuccessNotification = () => dispatch({ type: 'HIDE_SUCCESS' });

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        updateSize,
        clearCart,
        syncCart,
        toggleCart,
        openCart,
        closeCart,
        getCartItemByProductId
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

export const useEnhancedCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useEnhancedCart must be used within an EnhancedCartProvider');
  }
  return context;
};