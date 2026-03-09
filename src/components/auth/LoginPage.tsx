'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles } from 'lucide-react';

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: unknown }>;
  onSignUp: (email: string, password: string) => Promise<{ error: unknown }>;
}

export function LoginPage({ onSignIn, onSignUp }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = isSignUp
      ? await onSignUp(email, password)
      : await onSignIn(email, password);

    if (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } else if (isSignUp) {
      setSignUpSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-violet-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Creator Hub
            </h1>
          </div>
          <p className="text-sm text-zinc-500">Your complete social media career management hub</p>
        </div>

        <div className="bg-surface-card border border-zinc-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>

          {signUpSuccess ? (
            <div className="text-center py-4">
              <p className="text-sm text-emerald-600 font-medium mb-2">Account created!</p>
              <p className="text-xs text-zinc-500 mb-4">Check your email to confirm your account, then sign in.</p>
              <Button size="sm" onClick={() => { setIsSignUp(false); setSignUpSuccess(false); }}>
                Go to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>

              <p className="text-xs text-zinc-500 text-center">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  className="text-violet-600 hover:text-violet-800 font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
