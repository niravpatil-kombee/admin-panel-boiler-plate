import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { Brand } from '../types/product';

export interface GetBrandsResponse {
  message: string;
  totalBrands: number;
  brands: Brand[];
}

export interface GetBrandsResponseById {
  message: string;
  brand: Brand; 
}

export const getBrandsAPI = (): Promise<GetBrandsResponse> =>
  apiHandler(() => axios.get('/brands').then(res => res.data));

export const getBrandByIdAPI = (id: string): Promise<GetBrandsResponseById> =>
  apiHandler(() => axios.get(`/brands/${id}`).then(res => res.data));

export const createBrandAPI = (brand: Partial<Brand>): Promise<Brand> =>
  apiHandler(() => axios.post('/brands', brand).then(res => res.data));

export const updateBrandAPI = (id: string, brand: Partial<Brand>): Promise<Brand> =>
  apiHandler(() => axios.put(`/brands/${id}`, brand).then(res => res.data));

export const deleteBrandAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/brands/${id}`).then(() => undefined)); 