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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback className="text-2xl">{user.displayName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <CardTitle>{user.displayName}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-semibold">User ID: </span>
            <span className="text-muted-foreground">{user.uid}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">Email verified: </span>
            <span className="text-muted-foreground">{user.emailVerified ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
} 