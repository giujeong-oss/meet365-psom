'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ALLOWED_DOMAIN = 'meet365.net';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthorized = user?.email?.endsWith(`@${ALLOWED_DOMAIN}`) ?? false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      // Restrict to meet365.net domain
      provider.setCustomParameters({
        hd: ALLOWED_DOMAIN,
      });

      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Double-check domain on client side
      if (!email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
        await firebaseSignOut(auth);
        setError(`Only @${ALLOWED_DOMAIN} accounts are allowed`);
        setUser(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        // Handle popup closed by user
        if (err.message.includes('popup-closed-by-user')) {
          setError(null);
        } else {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOut,
        isAuthorized,
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
