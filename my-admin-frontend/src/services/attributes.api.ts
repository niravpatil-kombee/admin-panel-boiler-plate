import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { Attribute } from '../types/product';

export interface GetAttributesResponse {
  message: string;
  totalAttributes: number;
  attributes: Attribute[];
}

export interface GetAttributeByIdResponse {
  message: string;
  attribute: Attribute;
}

export const getAttributesAPI = (): Promise<GetAttributesResponse> =>
  apiHandler(() => axios.get('/attribute').then(res => res.data));

export const getAttributeByIdAPI = (id: string): Promise<GetAttributeByIdResponse> =>
  apiHandler(() => axios.get(`/attribute/${id}`).then(res => res.data));

export const createAttributeAPI = (attribute: FormData): Promise<Attribute> =>
  apiHandler(() => axios.post('/attribute', attribute).then(res => res.data.attribute));

export const updateAttributeAPI = (id: string, attribute: FormData): Promise<Attribute> =>
  apiHandler(() => axios.put(`/attribute/${id}`, attribute).then(res => res.data.attribute));

export const deleteAttributeAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/attribute/${id}`).then(() => undefined));