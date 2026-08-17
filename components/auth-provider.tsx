"use client";

import { createContext, useContext, useMemo } from "react";

type LocalUser = {
  id: string;
  email?: string;
};

type AuthResult = { error?: string; needsEmailConfirmation?: boolean };

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  user: LocalUser | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * v0.9+ no longer uses Supabase Auth.
 * This compatibility provider intentionally has no external auth dependency.
 * It remains only so stale files from pre-v0.9 deployments cannot break TypeScript builds.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AuthContextValue>(() => ({
    configured: false,
    loading: false,
    user: null,
    signIn: async () => ({ error: "v0.9+ da Supabase login olib tashlangan." }),
    signUp: async () => ({ error: "v0.9+ da Supabase login olib tashlangan." }),
    signOut: async () => {},
  }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      configured: false,
      loading: false,
      user: null,
      signIn: async () => ({ error: "Auth o‘chirilgan." }),
      signUp: async () => ({ error: "Auth o‘chirilgan." }),
      signOut: async () => {},
    } satisfies AuthContextValue;
  }
  return ctx;
}
