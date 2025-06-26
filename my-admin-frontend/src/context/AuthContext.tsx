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
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    const { user: fetchedUser } = await getMeAPI();
                    setUser(fetchedUser);
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
            setIsLoading(false);
        };
        initializeAuth();
    }, []);

    const setSession = (accessToken: string | null, refreshToken: string | null) => {
        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    const login = async (credentials: LoginCredentials) => {
        const { accessToken, refreshToken, user } = await loginAPI(credentials);
        setSession(accessToken, refreshToken);
        setUser(user);
        navigate('/dashboard');
    };

    const logout = () => {
        setSession(null, null);
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