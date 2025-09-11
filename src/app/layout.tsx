import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/nprogress.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ApiLoadingProvider } from '@/contexts/ApiLoadingContext';
import AuthCartWrapper from '@/components/AuthCartWrapper';

export const metadata: Metadata = {
  title: 'Garja - Premium Mens Fashion',
  description: 'Discover the latest in mens fashion with Garja. Premium clothing, worldwide delivery, and exceptional quality.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <ApiLoadingProvider>
          <AuthProvider>
            <CartProvider>
              <AuthCartWrapper>
                {children}
              </AuthCartWrapper>
            </CartProvider>
          </AuthProvider>
        </ApiLoadingProvider>
      </body>
    </html>
  );
}
