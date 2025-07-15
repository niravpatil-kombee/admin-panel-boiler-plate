import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType } from '../types/auth';
import { loginAPI, getMeAPI, logoutAPI } from '../services/auth.api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user: fetchedUser } = await getMeAPI();
        setUser(fetchedUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);
  const login = async (credentials: LoginCredentials) => {
    // 1. Call loginAPI. It will now return the user data.
    const { user: loggedInUser } = await loginAPI(credentials);
    
    // 2. Set the user state directly. No more timeouts, no second API call.
    setUser(loggedInUser);
    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch {}
    setUser(null);
    navigate('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
