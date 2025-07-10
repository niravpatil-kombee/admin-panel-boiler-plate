import { Schema, model } from 'mongoose';
import { IInventory } from '../types';

const InventorySchema = new Schema<IInventory>({
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  allowBackorder: { type: Boolean, default: false },
  lowStockThreshold: { type: Number },
  warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
}, { timestamps: true });

export default model<IInventory>('Inventory', InventorySchema); 