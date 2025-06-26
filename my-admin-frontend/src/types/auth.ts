export interface User {
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
        permissions: { _id: string, name: string }[];
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}