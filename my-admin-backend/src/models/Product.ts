import { Schema, model, Types } from 'mongoose';
import { IProduct, IAttributeValue, IVariant, IInventory } from '../types';

const AttributeValueSchema = new Schema({
  attributeId: {
    type: Schema.Types.ObjectId,
    ref: 'Attribute',
    required: true,
  },
  value: { type: Schema.Types.Mixed, required: true },
  fileUrl: { type: String },
}, { _id: false });

const VariantSchema = new Schema<IVariant>({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }],
  attributes: [AttributeValueSchema],
  inventory: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true},
  description: { type: String },
  brand: { type: Types.ObjectId, ref: 'Brand' },
  category: { type: Types.ObjectId, ref: 'Category' },
  collection: { type: Types.ObjectId, ref: 'Collection' },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  productAttributes: [AttributeValueSchema],
  variants: [VariantSchema],
}, { timestamps: true, suppressReservedKeysWarning: true });

export default model<IProduct>('Product', ProductSchema);
