import axios from '../utils/axios';
import type { Category } from '../types/product';

export const getCategoriesAPI = async (): Promise<Category[]> => {
  const { data } = await axios.get('/categories');
  return data;
};

export const getCategoryByIdAPI = async (id: string): Promise<Category> => {
  const { data } = await axios.get(`/categories/${id}`);
  return data;
};

export const createCategoryAPI = async (category: Partial<Category>): Promise<Category> => {
  const { data } = await axios.post('/categories', category);
  return data;
};

export const updateCategoryAPI = async (id: string, category: Partial<Category>): Promise<Category> => {
  const { data } = await axios.put(`/categories/${id}`, category);
  return data;
};

export const deleteCategoryAPI = async (id: string): Promise<void> => {
  await axios.delete(`/categories/${id}`);
}; 