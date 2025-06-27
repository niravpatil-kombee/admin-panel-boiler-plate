import { Schema, model } from 'mongoose';
import { IRole } from '../types';

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}, { timestamps: true });

export default model<IRole>('Role', RoleSchema);
