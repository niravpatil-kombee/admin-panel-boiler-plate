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

export const getMeAPI = async () => {
  const { data } = await axios.get('/auth/current-user');
  return data;
};

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
  role: string;
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

export const refreshSessionAPI = async () => {
  const { data } = await axios.post('/refresh-session');
  return data;
};

export const logoutAPI = async () => {
  const { data } = await axios.post('/auth/logout');
  return data;
};
