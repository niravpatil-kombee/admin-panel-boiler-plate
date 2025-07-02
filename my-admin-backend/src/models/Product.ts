import { Schema, model,  Document } from "mongoose";
import {
  IProduct,
  IInventory,
  IVariant,
  IProductAttribute,
  IPrice,
} from "../types";

export const ProductAttributeSchema = new Schema<IProductAttribute>(
  {
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

export const PriceSchema = new Schema<IPrice>(
  {
    currency: { type: String, default: 'USD', required: true },
    base: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
      default: 'flat',
    },
    finalPrice: { type: Number, required: true },
  },
  { _id: false }
);

export const InventorySchema = new Schema<IInventory>(
  {
    quantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    allowBackorders: { type: Boolean, default: false },
  },
  { _id: false }
);

export const VariantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: true, unique: true },
    size: { type: String },
    color: { type: String },
    images: [{ type: String }],
    price: { type: PriceSchema, required: true },
    inventory: { type: InventorySchema, required: true },
    stockAvailable: { type: Boolean, default: true },
    attributes: [ProductAttributeSchema],
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    mainImage: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    variants: { type: [VariantSchema], default: [] },
    attributes: { type: [ProductAttributeSchema], default: [] },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);


export default model<IProduct & Document>("Product", ProductSchema);
