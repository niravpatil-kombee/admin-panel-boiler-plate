import Brand from '../models/Brand';
import { IBrand } from '../types';

export const createBrand = async (data: Partial<IBrand>): Promise<IBrand> => {
  return await new Brand(data).save();
};

export const getBrands = async (): Promise<IBrand[]> => {
  return await Brand.find();
};

export const getBrandById = async (id: string): Promise<IBrand | null> => {
  return await Brand.findById(id);
};

export const updateBrand = async (id: string, data: Partial<IBrand>): Promise<IBrand | null> => {
  return await Brand.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBrand = async (id: string): Promise<IBrand | null> => {
  return await Brand.findByIdAndDelete(id);
};