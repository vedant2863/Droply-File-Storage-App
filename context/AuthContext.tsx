"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

import type { AuthUser, AuthContextValue } from "@/types";

export type User = AuthUser;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load current user profile
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else if (res.status === 401) {
        // Try refresh once
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (refreshRes.ok) {
          const retryMe = await fetch("/api/auth/me");
          if (retryMe.ok) {
            const data = await retryMe.json();
            setUser(data.user);
            return;
          }
        }
        setUser(null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Transparent authenticated fetch with 401 auto-rotation retry
  const authFetch = useCallback(
    async (url: string, init?: RequestInit): Promise<Response> => {
      let res = await fetch(url, init);

      if (res.status === 401) {
        // Token expired, attempt rotation
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (refreshRes.ok) {
          // Retry original request
          res = await fetch(url, init);
        } else {
          setUser(null);
          router.push("/sign-in");
        }
      }

      return res;
    },
    [router],
  );

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to sign in" };
      }

      setUser(data.user);
      router.push("/dashboard");
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Failed to create account",
        };
      }

      setUser(data.user);
      router.push("/dashboard");
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/sign-in");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
