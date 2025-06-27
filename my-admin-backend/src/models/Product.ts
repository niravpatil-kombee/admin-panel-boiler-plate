import { Schema, model, Types, Document } from "mongoose";
import {
  IProduct,
  IProductImage,
  IProductPrice,
  IProductInventory,
  IProductAttribute,
  IProductVariant,
} from "../types";

const ImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String },
    isFeatured: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
  },
  { _id: false }
);

const PriceSchema = new Schema<IProductPrice>(
  {
    base: { type: Number, required: true },
    discount: { type: Number },
    tiered: [
      {
        minQty: { type: Number },
        price: { type: Number },
      },
    ],
  },
  { _id: false }
);

const InventorySchema = new Schema<IProductInventory>(
  {
    quantity: { type: Number, required: true },
    sku: { type: String },
    lowStockThreshold: { type: Number, default: 5 },
    warehouseLocation: { type: String },
  },
  { _id: false }
);

const AttributeSchema = new Schema<IProductAttribute>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const VariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true },
    options: [{ type: String, required: true }],
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct & Document>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },

    tags: [{ type: String }],
    attributes: [AttributeSchema],
    variants: [VariantSchema],
    images: { type: [ImageSchema], default: [] },
    price: { type: PriceSchema, required: true },
    inventory: { type: InventorySchema, required: true },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default model<IProduct & Document>("Product", ProductSchema);
