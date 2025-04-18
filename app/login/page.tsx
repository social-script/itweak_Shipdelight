'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';

function LoginContent() {
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
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">itweak Sales</h1>
        <p className="text-gray-500 mt-2">
          Sign in with your email and password
        </p>
      </div>
      
      <LoginForm redirectPath={redirectPath} />
      
      {searchParams.has('from') && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-center text-sm">
          Authentication required to access this page.
          <br />
          You&apos;ll be redirected after signing in.
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <Suspense fallback={<div className="max-w-md mx-auto text-center">Loading...</div>}>
          <LoginContent />
        </Suspense>
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} itweak Sales. All rights reserved.</p>
      </footer>
    </div>
  );
} 