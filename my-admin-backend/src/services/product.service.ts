import Product, { IProductDocument } from '../models/Product';
import { IProduct } from '../types';

export const createProduct = async (data: IProduct): Promise<IProductDocument> => {
  const product = new Product(data);
  return await product.save();
};

export const getProducts = async (): Promise<IProductDocument[]> => {
  return await Product.find().sort({ createdAt: -1 });
};

export const getProductById = async (id: string): Promise<IProductDocument | null> => {
  return await Product.findById(id);
};

export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProductDocument | null> => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id: string): Promise<IProductDocument | null> => {
  return await Product.findByIdAndDelete(id);
};
