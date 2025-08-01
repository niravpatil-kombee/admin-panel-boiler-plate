import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { Collection } from '../types/product';

export interface GetCollectionsResponse {
  message: string;
  totalCollections: number;
  collections: Collection[];
}

export const getCollectionsAPI = (): Promise<GetCollectionsResponse> =>
  apiHandler(() => axios.get('/collections').then(res => res.data));

export const getCollectionByIdAPI = (id: string): Promise<Collection> =>
  apiHandler(() => axios.get(`/collections/${id}`).then(res => res.data));

export const createCollectionAPI = (collection: Partial<Collection>): Promise<Collection> =>
  apiHandler(() => axios.post('/collections', collection).then(res => res.data));

export const updateCollectionAPI = (id: string, collection: Partial<Collection>): Promise<Collection> =>
  apiHandler(() => axios.put(`/collections/${id}`, collection).then(res => res.data));

export const deleteCollectionAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/collections/${id}`).then(() => undefined)); 