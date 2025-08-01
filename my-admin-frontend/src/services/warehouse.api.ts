import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { Warehouse } from '../types/product';

export interface GetWarehousesResponse {
  message: string;
  totalWarehouses: number;
  warehouses: Warehouse[];
}

export interface GetWarehouseByIdResponse {
  message: string;
  warehouse: Warehouse;
}

export const getWarehousesAPI = (): Promise<GetWarehousesResponse> =>
  apiHandler(() => axios.get('/warehouse').then(res => res.data));

export const getWarehouseByIdAPI = (id: string): Promise<GetWarehouseByIdResponse> =>
  apiHandler(() => axios.get(`/warehouse/${id}`).then(res => res.data));

export const createWarehouseAPI = (warehouse: Partial<Warehouse>): Promise<Warehouse> =>
  apiHandler(() => axios.post('/warehouse', warehouse).then(res => res.data));

export const updateWarehouseAPI = (id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> =>
  apiHandler(() => axios.put(`/warehouse/${id}`, warehouse).then(res => res.data));

export const deleteWarehouseAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/warehouse/${id}`).then(() => undefined)); 