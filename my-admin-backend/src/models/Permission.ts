import { Schema, model, Document } from 'mongoose';

export interface IPermission extends Document {
    name: string;
    description?: string;
}

const PermissionSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, { timestamps: true });

export default model<IPermission>('Permission', PermissionSchema); 