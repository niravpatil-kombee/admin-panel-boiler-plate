import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { Category } from '../types/product';

export interface GetCategoriesResponse {
  message: string;
  totalCategories: number;
  categories: Category[];
}

export interface GetCategoryByIdResponse {
  message: string;
  category: Category;
}

export const getCategoryByIdAPI = (id: string): Promise<GetCategoryByIdResponse> =>
  apiHandler(() => axios.get(`/categories/${id}`).then(res => res.data));

export const getCategoriesAPI = (): Promise<GetCategoriesResponse> =>
  apiHandler(() => axios.get('/categories').then(res => res.data));

export const createCategoryAPI = (category: Partial<Category>): Promise<Category> =>
  apiHandler(() => axios.post('/categories', category).then(res => res.data));

export const updateCategoryAPI = (id: string, category: Partial<Category>): Promise<Category> =>
  apiHandler(() => axios.put(`/categories/${id}`, category).then(res => res.data));

export const deleteCategoryAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/categories/${id}`).then(() => undefined)); 