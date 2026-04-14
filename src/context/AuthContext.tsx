import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { getCurrentUser, clearSession } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = () => {
    const u = getCurrentUser();
    setUser(u);
  };

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setIsLoading(false);
  }, []);

  const login = (u: User) => setUser(u);

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
