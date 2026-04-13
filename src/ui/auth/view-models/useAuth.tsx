import { authRepository } from '@/src/data/repositories/auth/auth-repository';
import messages from '@/src/shared/constants/messages';
import { useAlertBoxStore } from '@/src/shared/hooks/use-alert-box';
import { useLoadingStore } from '@/src/shared/hooks/use-loading';
import { Session, User, AuthError, Subscription } from '@supabase/supabase-js';
import * as Network from 'expo-network';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { setMessage, setIsVisible } = useAlertBoxStore();

  const { setIsLoading } = useLoadingStore();

  useEffect(() => {
    const checkNetworkAndSession = async () => {
      try {
        setIsLoading(true);

        const networkState = await Network.getNetworkStateAsync();
        const isConnected = networkState.isConnected ?? false;

        const session = await authRepository.getSession();

        if (session) {
          if (!isConnected) {
            // User is offline - sign out
            await authRepository.signOut();
            setSession(null);
            router.replace('/(auth)/login');
          } else {
            setSession(session);
            router.replace('/(tabs)');
          }
        } else {
          router.replace('/(auth)/login');
        }
      } catch {
        setMessage('Erro ao verificar sessão. Tente novamente.');
        setIsVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkNetworkAndSession();

    let subscription: { subscription: Subscription } | null = null;

    try {
      const { data } = authRepository.onAuthStateChange((newSession) => {
        setSession(newSession);
      });
      subscription = data;
    } catch (error) {
      console.error('Error on auth state change listener:', JSON.stringify(error));
    }

    return () => {
      if (subscription?.subscription) {
        subscription.subscription.unsubscribe();
      }
    };
  }, []);

  async function signIn(email: string, password: string) {
    setIsLoading(true);
    const { error } = await authRepository.signIn(email, password);

    if (error) {
      const authError = error as AuthError;
      const message = messages[authError?.status as number] as string;

      setMessage(message);
      setIsVisible(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      router.replace('/(tabs)');
    }
  }

  async function signOut() {
    setIsLoading(true);
    const { error } = await authRepository.signOut();

    if (error) {
      const authError = error as AuthError;
      const message = messages[authError.status as number] as string;
      setMessage(message);
      setIsVisible(true);
    }

    setIsLoading(false);
    router.replace('/(auth)/login');
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
