import { Types, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description?: string;
}

export interface IRole extends Document {
  name: string;
  permissions: Types.ObjectId[]; // references to Permission
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Types.ObjectId; // reference to Role
  isEmailVerified: boolean;
  comparePassword(password: string): Promise<boolean>;
}

export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  category: Types.ObjectId;
  brand?: Types.ObjectId;
  tags?: string[];
  attributes?: IProductAttribute[];
  variants?: IProductVariant[];
  images: IProductImage[];
  price: IProductPrice;
  inventory: IProductInventory;
  isFeatured?: boolean;
  isActive: boolean;
}

export interface IProductImage {
  url: string;
  alt?: string;
  isFeatured?: boolean;
  position?: number;
}

export interface IProductPrice {
  base: number;
  discount?: number;
  tiered?: { minQty: number; price: number }[];
}

export interface IProductInventory {
  quantity: number;
  sku?: string;
  lowStockThreshold?: number;
  warehouseLocation?: string;
}

export interface IProductAttribute {
  key: string;
  value: string;
}

export interface IProductVariant {
  name: string;
  options: string[];
}

export interface ICategory {
  name: string;
  slug: string;
  parent?: Types.ObjectId;
  description?: string;
  image?: string;
}

export interface IBrand {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface ICollection {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products: Types.ObjectId[];
}
 
  
