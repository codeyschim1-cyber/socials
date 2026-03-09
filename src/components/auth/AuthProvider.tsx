'use client';

import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';
import { LoginPage } from './LoginPage';

interface AuthContextType {
  user: User;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, signUp, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
