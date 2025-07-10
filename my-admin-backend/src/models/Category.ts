import { Schema, model, Types, Document } from 'mongoose';
import { ICategory } from '../types';

const CategorySchema = new Schema<ICategory & Document>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  // parent: { type: Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

export default model<ICategory & Document>('Category', CategorySchema);
