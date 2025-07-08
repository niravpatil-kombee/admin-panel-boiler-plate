export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null | { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collection {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  products?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Attribute {
  _id?: string;
  name: string;
  slug: string;
  inputType: 'text' | 'dropdown' | 'multi-select' | 'file';
  options?: string[];
  isRequired?: boolean;
  isVariantLevel?: boolean;
}

export interface AttributeValue {
  attributeId: string;
  value: string;
  fileUrl?: string; 
}

export interface Inventory {
  sku: string;
  quantity: number;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
}

export interface Variant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  images?: string[]; // File paths (e.g., from multer)
  attributes: AttributeValue[];
  inventory: Inventory;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  category: string; // ObjectId
  brand: string; // ObjectId
  tags?: string[];
  isPublished?: boolean;
  productAttributes: AttributeValue[]; // Product-level attributes
  variants: Variant[];
  createdAt?: string;
  updatedAt?: string;
}
