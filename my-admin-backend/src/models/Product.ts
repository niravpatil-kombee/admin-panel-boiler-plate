import { Schema, model, Document } from "mongoose";
import type { IProduct } from "../types";

export interface IProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: String,
    image: { type: String },
  },
  { timestamps: true }
);

export default model<IProductDocument>("Product", ProductSchema);
