'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut } from "lucide-react";

export default function AuthButton() {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  if (loading) {
    return (
      <Button disabled variant="outline" size="sm">
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-2 ring-purple-500/50">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white">{user.displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline">{user.displayName}</span>
        </div>
        <Button onClick={logout} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle} size="sm" className="button-gradient">
      <LogIn className="h-4 w-4 mr-2" />
      Sign in with Google
    </Button>
  );
} 