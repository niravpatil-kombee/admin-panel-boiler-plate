import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType } from '../types/auth';
import { loginAPI, getMeAPI } from '../services/auth.api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
                try {
                    const { user: fetchedUser } = await getMeAPI();
                    setUser(fetchedUser);
                } catch (error) {
                setUser(null);
            }
            setIsLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await loginAPI(credentials);
        const { user: fetchedUser } = await getMeAPI();
        setUser(fetchedUser);
        navigate('/dashboard');
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch {}
        setUser(null);
        navigate('/auth/login');
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;