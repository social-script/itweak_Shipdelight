'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function LoginForm() {
  const { signInWithGoogle } = useAuth();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Welcome</CardTitle>
        <CardDescription className="text-center">
          Sign in to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>This is a boilerplate for Firebase authentication with Next.js.</p>
          <p>Click the button below to sign in with your Google account.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full" 
          onClick={signInWithGoogle}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
} 