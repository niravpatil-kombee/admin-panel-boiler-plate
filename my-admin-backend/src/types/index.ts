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
  password: string;
  role: Types.ObjectId; // reference to Role
  isEmailVerified: boolean;
  comparePassword(password: string): Promise<boolean>;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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

export interface IProductAttribute {
  key: string;
  value: string | number | boolean;
}

export interface IPrice {
  currency: string;
  base: number;
  discount: number;
  discountType: 'flat' | 'percentage';
  finalPrice: number;
}

export interface IInventory {
  quantity: number;
  lowStockThreshold: number;
  allowBackorders: boolean;
}

export interface IVariant {
  sku: string;
  size: string;
  color: string;
  images: string[];
  price: IPrice;
  inventory: IInventory;
  stockAvailable: boolean;
  attributes: IProductAttribute[];
}

export interface IProduct extends Document {
  title: string;
  description?: string;
  slug: string;
  mainImage: string;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  variants: IVariant[];
  attributes: IProductAttribute[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}
 
  
