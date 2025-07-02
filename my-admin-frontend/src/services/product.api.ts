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
  const { data } = await axios.get<{ product: Product }>(`/product/${id}`);
  return data.product;
};

export const createProductAPI = async (formData: FormData): Promise<Product> => {
  const { data } = await axios.post<{ product: Product }>('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data.product;
};

export const updateProductAPI = async (id: string, formData: FormData): Promise<Product> => {
  const { data } = await axios.put<{ product: Product }>(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data.product;
};

export const deleteProductAPI = async (id: string): Promise<void> => {
  await axios.delete(`/product/${id}`);
};
