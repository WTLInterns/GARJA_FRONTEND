'use client';

import { useAuth } from '@/contexts/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-bold text-sm mb-2">Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        {user && (
          <div>
            <div>ID: {user.id}</div>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
          </div>
        )}
        <div>Token: {localStorage.getItem('token') ? 'Present' : 'None'}</div>
      </div>
    </div>
  );
};

export default AuthDebug;
