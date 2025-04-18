'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md hover:shadow-lg transition-shadow border-purple-100 dark:border-purple-900/30">
      <CardHeader className="flex flex-col items-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-t-lg pb-6">
        <Avatar className="h-24 w-24 mb-4 ring-4 ring-white dark:ring-slate-800 shadow-md">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-2xl">{user.displayName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">{user.displayName}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-6">
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
          <span className="font-semibold text-purple-700 dark:text-purple-300">User ID:</span>
          <span className="text-muted-foreground truncate">{user.uid}</span>
          
          <span className="font-semibold text-purple-700 dark:text-purple-300">Email verified:</span>
          <span className={`${user.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {user.emailVerified ? 'Yes' : 'No'}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950 dark:hover:text-purple-200" 
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
} 