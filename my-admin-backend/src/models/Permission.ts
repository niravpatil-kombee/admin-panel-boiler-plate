import { Schema, model } from 'mongoose';
import { IPermission } from '../types';

const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

export default model<IPermission>('Permission', PermissionSchema);
