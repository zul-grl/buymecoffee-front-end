"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserContextType {
  userId: number | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      clearError();
      try {
        const response = await axios.post("/api/auth/sign-in", {
          email,
          password,
        });

        localStorage.setItem("userId", response.data.data.id);
        setUserId(response.data.data.id);
        router.push("/createProfile");
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || "Login failed";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [router, clearError]
  );

  const signup = useCallback(
    async (username: string, email: string, password: string) => {
      setLoading(true);
      clearError();
      try {
        const response = await axios.post("/api/auth/sign-up", {
          username,
          email,
          password,
        });

        router.push("/sign-in");
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || "Signup failed";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [router, clearError]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("userId");
    setUserId(null);
    router.push("/sign-in");
  }, [router]);

  const value = {
    userId,
    loading,
    login,
    signup,
    logout,
    error,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
