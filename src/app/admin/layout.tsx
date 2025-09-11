'use client';

import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import '@/styles/nprogress.css';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
