export interface IProductImage { url: string; alt?: string; isFeatured: boolean; position: number; }
export interface ITieredPrice { minQty: number; price: number; }
export interface IProductPrice { base: number; discount?: number; tiered?: ITieredPrice[]; }
export interface IProductInventory { quantity: number; sku?: string; lowStockThreshold?: number; warehouseLocation?: string; }
export interface IProductAttribute { key: string; value: string; }
export interface IProductVariant { name: string; options: string[]; }
export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  brand?: string;
  tags?: string[];
  attributes?: IProductAttribute[];
  variants?: IProductVariant[];
  images?: IProductImage[];
  price: IProductPrice;
  inventory: IProductInventory;
  isFeatured: boolean;
  isActive: boolean;
  availableFrom?: string;
}

export interface Category {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    parent?: string;
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
