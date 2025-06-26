import { Schema, model, Document, Types } from 'mongoose';

export interface IRole extends Document {
    name: string;
    permissions: Types.ObjectId[];
}

const RoleSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
}, { timestamps: true });

export default model<IRole>('Role', RoleSchema); 