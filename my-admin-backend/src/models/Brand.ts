import { Schema, model, Document } from 'mongoose';
import { IBrand } from '../types';

const BrandSchema = new Schema<IBrand & Document>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { type: String },
}, { timestamps: true });

export default model<IBrand & Document>('Brand', BrandSchema);
