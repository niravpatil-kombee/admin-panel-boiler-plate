import { Schema, model, Document } from 'mongoose';
import { IAttribute } from '../types';

const AttributeSchema = new Schema<IAttribute & Document>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    inputType: { type: String, enum: ['text', 'dropdown', 'multi-select', 'file'], required: true },
    options: [{ type: String }],
    isRequired: { type: Boolean, default: false },
    isVariantLevel: { type: Boolean, default: false },
  }, { timestamps: true });

export default model<IAttribute & Document>('Attribute', AttributeSchema);
