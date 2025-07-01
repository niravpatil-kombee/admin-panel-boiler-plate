import axios from '../utils/axios';
import type { Collection } from '../types/product';

export interface GetCollectionsResponse {
  message: string;
  totalCollections: number;
  collections: Collection[];
}

export const getCollectionsAPI = async (): Promise<GetCollectionsResponse> => {
  const { data } = await axios.get('/collections');
  return data;
};

export const getCollectionByIdAPI = async (id: string): Promise<Collection> => {
  const { data } = await axios.get(`/collections/${id}`);
  return data;
};

export const createCollectionAPI = async (collection: Partial<Collection>): Promise<Collection> => {
  const { data } = await axios.post('/collections', collection);
  return data;
};

export const updateCollectionAPI = async (id: string, collection: Partial<Collection>): Promise<Collection> => {
  const { data } = await axios.put(`/collections/${id}`, collection);
  return data;
};

export const deleteCollectionAPI = async (id: string): Promise<void> => {
  await axios.delete(`/collections/${id}`);
}; 