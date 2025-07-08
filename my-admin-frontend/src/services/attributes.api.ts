import axios from '../utils/axios';
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

export const getAttributesAPI = async (): Promise<GetAttributesResponse> => {
  const { data } = await axios.get('/attribute');
  return data;
};

export const getAttributeByIdAPI = async (id: string): Promise<GetAttributeByIdResponse> => {
  const { data } = await axios.get(`/attribute/${id}`);
  return data;
};

export const createAttributeAPI = async (attribute: FormData): Promise<Attribute> => {
  const { data } = await axios.post('/attribute', attribute);
  return data.attribute;
};

export const updateAttributeAPI = async (id: string, attribute: FormData): Promise<Attribute> => {
  const { data } = await axios.put(`/attribute/${id}`, attribute);
  return data.attribute;
};

export const deleteAttributeAPI = async (id: string): Promise<void> => {
  await axios.delete(`/attribute/${id}`);
};  