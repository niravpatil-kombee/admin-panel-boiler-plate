import Product from '../models/Product';
import { IProduct } from '../types';
import { Types } from 'mongoose';

export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const product = new Product(data);
  return await product.save();
};

export const getProducts = async (filters: any = {}, options: any = {}): Promise<IProduct[]> => {
  return await Product.find(filters)
    .populate('category brand')
    .sort(options.sort || '-createdAt')
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id).populate('category brand');
};

export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, data, { new: true }).populate('category brand');
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return await Product.findByIdAndDelete(id);
};
