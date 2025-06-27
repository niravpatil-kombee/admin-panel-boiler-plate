import axios from '../utils/axios';
import type { LoginCredentials, RegisterData, User } from '../types/auth';

export const loginAPI = async (credentials: LoginCredentials) => {
    const { data } = await axios.post('/auth/login', credentials);
    return data;
};

export const registerAPI = async (userData: RegisterData) => {
    const { data } = await axios.post('/auth/register', userData);
    return data;
};

// We need to fetch the user profile to validate the token on initial load
// For now, let's create a placeholder "get me" endpoint on the backend
// And the corresponding API call here.
// **Action Required in Backend (see step 2)**
export const getMeAPI = async () => {
    const { data } = await axios.get('/auth/me');
    return data;
}

export const getUsersAPI = async (): Promise<User[]> => {
    const { data } = await axios.get('/users');
    return data;
};

export const deleteUserAPI = async (id: string): Promise<void> => {
    await axios.delete(`/users/${id}`);
};

export interface UserFormData {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: string; // role ID
}

export const getUserByIdAPI = async (id: string): Promise<User> => {
    const { data } = await axios.get(`/users/${id}`);
    return data;
};

export const createUserAPI = async (userData: UserFormData): Promise<User> => {
    const { data } = await axios.post('/users', userData);
    return data;
};

export const updateUserAPI = async (id: string, userData: Partial<UserFormData>): Promise<User> => {
    const { data } = await axios.put(`/users/${id}`, userData);
    return data;
};