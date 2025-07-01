import axios from '../utils/axios';
import type { Product } from '../types/product';

export interface GetProductsResponse {
  message: string;
  totalProducts: number;
  products: Product[];
}

export const getProductsAPI = async (): Promise<GetProductsResponse> => {
  const { data } = await axios.get('/product');
  return data;
};

export const getProductByIdAPI = async (id: string): Promise<Product> => {
  const { data } = await axios.get(`/product/${id}`);
  return data;
};

export const createProductAPI = async (formData: FormData): Promise<Product> => {
  const { data } = await axios.post('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateProductAPI = async (id: string, formData: FormData): Promise<Product> => {
  const { data } = await axios.put(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteProductAPI = async (id: string): Promise<void> => {
  await axios.delete(`/product/${id}`);
};
