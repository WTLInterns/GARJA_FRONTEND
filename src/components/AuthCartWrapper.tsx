'use client';

import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface AuthCartWrapperProps {
  children: React.ReactNode;
}

const AuthCartWrapper: React.FC<AuthCartWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const wasAuthenticatedRef = useRef<boolean | null>(null);

  // Clear cart only when user actively logs out (was authenticated, now not)
  useEffect(() => {
    // Skip on initial render
    if (wasAuthenticatedRef.current === null) {
      wasAuthenticatedRef.current = isAuthenticated;
      return;
    }

    // Clear cart only if user was authenticated before and now is not (logout scenario)
    if (wasAuthenticatedRef.current === true && !isAuthenticated) {
      clearCart();
    }

    wasAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, clearCart]);

  return <>{children}</>;
};

export default AuthCartWrapper;
