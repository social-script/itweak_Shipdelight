'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import LoginForm from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Itweak SD
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            </div>
          ) : (
            <div className="mt-8">
              {user ? (
                <div className="space-y-8">
                  <UserProfile />
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                      <Button className="w-full md:w-auto">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full md:w-auto">
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <LoginForm />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-muted-foreground">
            © {new Date().getFullYear()} Itweak SD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
