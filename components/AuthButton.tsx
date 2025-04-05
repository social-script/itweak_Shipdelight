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
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline">{user.displayName}</span>
        </div>
        <Button onClick={logout} variant="destructive" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle} variant="default" size="sm">
      <LogIn className="h-4 w-4 mr-2" />
      Sign in with Google
    </Button>
  );
} 