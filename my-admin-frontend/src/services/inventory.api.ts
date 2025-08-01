import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
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

export const getInventoryListAPI = (): Promise<GetInventoryListResponse> =>
  apiHandler(() => axios.get('/inventory').then(res => res.data));

export const getInventoryByIdAPI = (id: string): Promise<GetInventoryByIdResponse> =>
  apiHandler(() => axios.get(`/inventory/${id}`).then(res => res.data));

export const createInventoryAPI = (inventory: Partial<Inventory>): Promise<Inventory> =>
  apiHandler(() => axios.post('/inventory', inventory).then(res => res.data));

export const updateInventoryAPI = (id: string, inventory: Partial<Inventory>): Promise<Inventory> =>
  apiHandler(() => axios.put(`/inventory/${id}`, inventory).then(res => res.data));

export const deleteInventoryAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/inventory/${id}`).then(() => undefined)); 