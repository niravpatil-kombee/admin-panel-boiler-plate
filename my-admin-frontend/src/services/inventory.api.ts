import axios from '../utils/axios';
import type { Inventory } from '../types/product';

export interface GetInventoryListResponse {
  message: string;
  total: number;
  inventories: Inventory[];
}

export interface GetInventoryByIdResponse {
  message: string;
  inventory: Inventory;
}

export const getInventoryListAPI = async (): Promise<GetInventoryListResponse> => {
  const { data } = await axios.get('/inventory');
  return data;
};

export const getInventoryByIdAPI = async (id: string): Promise<GetInventoryByIdResponse> => {
  const { data } = await axios.get(`/inventory/${id}`);
  return data;
};

export const createInventoryAPI = async (inventory: Partial<Inventory>): Promise<Inventory> => {
  const { data } = await axios.post('/inventory', inventory);
  return data;
};

export const updateInventoryAPI = async (id: string, inventory: Partial<Inventory>): Promise<Inventory> => {
  const { data } = await axios.put(`/inventory/${id}`, inventory);
  return data;
};

export const deleteInventoryAPI = async (id: string): Promise<void> => {
  await axios.delete(`/inventory/${id}`);
}; 