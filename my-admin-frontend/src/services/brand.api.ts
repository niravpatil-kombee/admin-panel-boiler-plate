import axios from '../utils/axios';
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


export const getBrandsAPI = async (): Promise<GetBrandsResponse> => {
  const { data } = await axios.get('/brands');
  return data;
};

export const getBrandByIdAPI = async (id: string): Promise<GetBrandsResponseById> => {
  const { data } = await axios.get(`/brands/${id}`);
  return data;
};

export const createBrandAPI = async (brand: Partial<Brand>): Promise<Brand> => {
  const { data } = await axios.post('/brands', brand);
  return data;
};

export const updateBrandAPI = async (id: string, brand: Partial<Brand>): Promise<Brand> => {
  const { data } = await axios.put(`/brands/${id}`, brand);
  return data;
};

export const deleteBrandAPI = async (id: string): Promise<void> => {
  await axios.delete(`/brands/${id}`);
}; 