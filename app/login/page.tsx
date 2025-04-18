'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('from') || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath);
    }
  }, [user, loading, router, redirectPath]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-gray-500 mt-2">
              Sign in to access protected areas of the application
            </p>
          </div>
          
          <LoginForm redirectPath={redirectPath} />
          
          {searchParams.has('from') && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-center text-sm">
              You need to be logged in to access this page.
              <br />
              You'll be redirected after signing in.
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 