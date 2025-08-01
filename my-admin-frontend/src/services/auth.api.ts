import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
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

export const loginAPI = (credentials: LoginCredentials) =>
  apiHandler(() => axios.post('/auth/login', credentials).then(res => res.data));

export const registerAPI = (userData: RegisterData) =>
  apiHandler(() => axios.post('/auth/register', userData).then(res => res.data));

export const getMeAPI = () =>
  apiHandler(() => axios.get('/auth/current-user').then(res => res.data));

export const logoutAPI = () =>
  apiHandler(() => axios.post('/auth/logout').then(res => res.data));

export const forgotPasswordAPI = (email: string) =>
  apiHandler(() => axios.post('/auth/forgot-password', { email }).then(res => res.data));

export const resetPasswordAPI = (token: string, newPassword: string) =>
  apiHandler(() => axios.post(`/auth/reset-password/${token}`, { newPassword }).then(res => res.data));

export const getUsersAPI = (): Promise<GetUsersResponse> =>
  apiHandler(() => axios.get('/users').then(res => res.data));

export const deleteUserAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/users/${id}`).then(() => undefined));

export const getUserByIdAPI = (id: string): Promise<User> =>
  apiHandler(() => axios.get(`/users/${id}`).then(res => res.data.user));

export const createUserAPI = (userData: UserFormData): Promise<User> =>
  apiHandler(() => axios.post('/users', userData).then(res => res.data));

export const updateUserAPI = (id: string, userData: Partial<UserFormData>): Promise<User> =>
  apiHandler(() => axios.put(`/users/${id}`, userData).then(res => res.data));
