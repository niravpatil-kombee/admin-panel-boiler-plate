import axios from '../utils/axios';
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

export const getWarehousesAPI = async (): Promise<GetWarehousesResponse> => {
  const { data } = await axios.get('/warehouse');
  return data;
};

export const getWarehouseByIdAPI = async (id: string): Promise<GetWarehouseByIdResponse> => {
  const { data } = await axios.get(`/warehouse/${id}`);
  return data;
};

export const createWarehouseAPI = async (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  const { data } = await axios.post('/warehouse', warehouse);
  return data;
};

export const updateWarehouseAPI = async (id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  const { data } = await axios.put(`/warehouse/${id}`, warehouse);
  return data;
};

export const deleteWarehouseAPI = async (id: string): Promise<void> => {
  await axios.delete(`/warehouse/${id}`);
}; 