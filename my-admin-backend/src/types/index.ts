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
  // parent?: Types.ObjectId;
  description?: string;
}

export interface IBrand {
  name: string;
  slug: string;
  description?: string;
}

export interface ICollection {
  name: string;
  slug: string;
  description?: string;
}

export type AttributeInputType = 'text' | 'dropdown' | 'multi-select' | 'file';

export interface IAttribute extends Document {
  name: string;
  slug: string;
  inputType: AttributeInputType;
  options?: string[]; // for dropdown or multi-select
  isRequired: boolean;
  isVariantLevel: boolean;
}

export interface IAttributeValue {
  attributeId: string; // Refers to Attribute._id
  value: string | string[]; // Can be text or selected option(s)
  fileUrl?: string; // Used if inputType === 'file'
}

export interface IInventory {
  sku: string;
  quantity: number;
  allowBackorder: boolean;
  lowStockThreshold?: number;
  warehouse: Types.ObjectId; // Reference to Warehouse
}

export interface IVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  attributes: IAttributeValue[];
  inventory: IInventory;
}

export interface IGeoLocation {
  lat: number;
  lng: number;
}

export interface IWarehouse extends Document {
  name: string;
  code: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  geoLocation: IGeoLocation; 
}


export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  category?: string;
  tags?: string[];
  isPublished: boolean;
  productAttributes: IAttributeValue[];
  variants: IVariant[];
  collection?: string;
}

 
  
