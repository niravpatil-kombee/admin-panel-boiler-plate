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


export interface Price {
  base: number;
  discount?: number;
  discountType?: 'flat' | 'percentage';
  finalPrice: number;
}

export interface Inventory {
  quantity: number;
  lowStockThreshold?: number;
  allowBackorders?: boolean;
}

export interface Attribute {
  key: string;
  value: string;
}

export interface Image {
  url: string;
  alt?: string;
}

export interface Variant {
  sku: string;
  size?: string;
  color?: string;
  images?: string[]; // or Image[] if you manage multiple image fields
  price: Price;
  inventory: Inventory;
  stockAvailable?: boolean;
  attributes?: Attribute[];
}

export interface Product {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  brand: string;
  attributes?: Attribute[];
  variants?: Variant[];
  images?: Image[];
  price?: Price;
  inventory?: Inventory;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

