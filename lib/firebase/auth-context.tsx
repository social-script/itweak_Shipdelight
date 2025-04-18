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
import Cookies from 'js-cookie';

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

// Cookie names
const AUTH_COOKIE_NAME = 'firebase-auth-token';
const USER_COOKIE_NAME = 'user-data';

// Cookie options - httpOnly would be better but requires server-side handling
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasValidTokens, setHasValidTokens] = useState(false);

  // Set cookies for authenticated user
  const setCookiesForUser = async (currentUser: User) => {
    try {
      // Get ID token
      const token = await currentUser.getIdToken();
      
      // Set token cookie
      Cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
      
      // Set minimal user data cookie (non-sensitive info)
      const userData = {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified
      };
      
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), COOKIE_OPTIONS);
    } catch (error) {
      console.error('Error setting auth cookies:', error);
    }
  };

  // Remove auth cookies
  const removeCookies = () => {
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
    Cookies.remove(USER_COOKIE_NAME, { path: '/' });
  };

  // Check if user has valid tokens
  const checkTokens = async (currentUser: User | null) => {
    if (!currentUser) {
      setHasValidTokens(false);
      removeCookies();
      return;
    }
    
    try {
      // This will throw an error if the token is invalid/expired
      const token = await currentUser.getIdToken(false);
      setHasValidTokens(!!token);
      
      // Refresh the cookies when we check tokens
      await setCookiesForUser(currentUser);
    } catch (error) {
      console.error('Error checking tokens:', error);
      setHasValidTokens(false);
      removeCookies();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // User is signed in, set cookies
        setCookiesForUser(user);
      } else {
        // User is signed out, remove cookies
        removeCookies();
      }
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
      toast.error('Google sign-in has been disabled by the administrator');
      throw new Error('Google sign-in has been disabled');
      
      // The following code is intentionally unreachable
      /*
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await setCookiesForUser(result.user);
      toast.success('Successfully signed in!');
      */
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Google sign-in is not available');
      removeCookies();
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await setCookiesForUser(result.user);
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
      removeCookies();
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
      
      // Set cookies for the new user
      await setCookiesForUser(userCredential.user);
      
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
      removeCookies();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      removeCookies();
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