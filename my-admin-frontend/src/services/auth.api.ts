import axios from '../utils/axios';
import type { LoginCredentials, RegisterData, User } from '../types/auth';

export interface GetUsersResponse {
  message: string;
  totalUsers: number;
  users: User[];
}
export interface UserFormData {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export const loginAPI = async (credentials: LoginCredentials) => {
  const { data } = await axios.post('/auth/login', credentials);
  return data;
};

export const registerAPI = async (userData: RegisterData) => {
  const { data } = await axios.post('/auth/register', userData);
  return data;
};

export const getMeAPI = async () => {
  const { data } = await axios.get('/auth/current-user', {
    headers: {
      // This is our special signal to the interceptor
      'X-No-Retry-On-401': 'true' 
    }
  });
  return data;
};

export const logoutAPI = async () => {
  const { data } = await axios.post('/auth/logout');
  return data;
};

export const forgotPasswordAPI = async (email: string) => {
  const { data } = await axios.post('/auth/forgot-password', { email });
  return data;
};

export const resetPasswordAPI = async (token: string, newPassword: string) => {
  const { data } = await axios.post(`/auth/reset-password/${token}`, { newPassword });
  return data;
};


export const getUsersAPI = async (): Promise<GetUsersResponse> => {
  const { data } = await axios.get('/users');
  return data;
};

export const deleteUserAPI = async (id: string): Promise<void> => {
  await axios.delete(`/users/${id}`);
};

export const getUserByIdAPI = async (id: string): Promise<User> => {
  const { data } = await axios.get(`/users/${id}`);
  return data.user;
};

export const createUserAPI = async (userData: UserFormData): Promise<User> => {
  const { data } = await axios.post('/users', userData);
  return data;
};

export const updateUserAPI = async (id: string, userData: Partial<UserFormData>): Promise<User> => {
  const { data } = await axios.put(`/users/${id}`, userData);
  return data;
};



