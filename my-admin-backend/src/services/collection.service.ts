import Collection from '../models/Collection';
import { ICollection } from '../types';

export const createCollection = async (data: Partial<ICollection>): Promise<ICollection> => {
  return await new Collection(data).save();
};

export const getCollections = async (): Promise<ICollection[]> => {
  return await Collection.find().populate('products');
};

export const getCollectionById = async (id: string): Promise<ICollection | null> => {
  return await Collection.findById(id).populate('products');
};

export const updateCollection = async (id: string, data: Partial<ICollection>): Promise<ICollection | null> => {
  return await Collection.findByIdAndUpdate(id, data, { new: true }).populate('products');
};

export const deleteCollection = async (id: string): Promise<ICollection | null> => {
  return await Collection.findByIdAndDelete(id);
};