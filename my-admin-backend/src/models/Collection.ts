import { Schema, model, Types, Document } from 'mongoose';
import { ICollection } from '../types';

const CollectionSchema = new Schema<ICollection & Document>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

export default model<ICollection & Document>('Collection', CollectionSchema);
