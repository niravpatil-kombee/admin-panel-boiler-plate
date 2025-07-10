import { Schema, model, Document } from 'mongoose';
import { IWarehouse } from '../types';

const GeoLocationSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { _id: false });

const WarehouseSchema = new Schema<IWarehouse>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  postalCode: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  isActive: { type: Boolean, default: true },
  geoLocation: { type: GeoLocationSchema, required: true },
}, { timestamps: true });

export default model<IWarehouse>('Warehouse', WarehouseSchema); 