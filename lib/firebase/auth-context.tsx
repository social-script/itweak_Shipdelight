'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from './firebase-config';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createUserWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  hasValidTokens: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasValidTokens, setHasValidTokens] = useState(false);

  // Check if user has valid tokens
  const checkTokens = async (currentUser: User | null) => {
    if (!currentUser) {
      setHasValidTokens(false);
      return;
    }
    
    try {
      // This will throw an error if the token is invalid/expired
      const token = await currentUser.getIdToken(false);
      setHasValidTokens(!!token);
    } catch (error) {
      console.error('Error checking tokens:', error);
      setHasValidTokens(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      checkTokens(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Periodically check token validity (every 5 minutes)
  useEffect(() => {
    if (!user) return;
    
    const tokenCheckInterval = setInterval(() => {
      checkTokens(user);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(tokenCheckInterval);
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      let errorMessage = 'Failed to sign in with email and password';
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createUserWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with the display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Error creating account:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        createUserWithEmail,
        logout,
        hasValidTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 