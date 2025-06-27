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
    description?: string;
    price: number;
    stock: number;
    category?: string;
    image?: string;
}
  
