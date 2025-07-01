import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// // Hash password before saving
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password') || !this.password) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err as Error);
//   }
// });

// // Compare method
// UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
//   if (!this.password) return false;
//   return await bcrypt.compare(enteredPassword, this.password);
// };

export default model<IUser>('User', UserSchema);
