import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { Product } from '../types/product';

export interface GetProductsResponse {
  message: string;
  totalProducts: number;
  products: Product[];
}

export const getProductsAPI = (): Promise<GetProductsResponse> =>
  apiHandler(() => axios.get('/product').then(res => res.data));

export const getProductByIdAPI = (id: string): Promise<Product> =>
  apiHandler(() => axios.get<{ product: Product }>(`/product/${id}`).then(res => res.data.product));

export const createProductAPI = (formData: FormData): Promise<Product> =>
  apiHandler(() => axios.post<{ product: Product }>('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data.product));

export const updateProductAPI = (id: string, formData: FormData): Promise<Product> =>
  apiHandler(() => axios.put<{ product: Product }>(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data.product));

export const deleteProductAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/product/${id}`).then(() => undefined));
