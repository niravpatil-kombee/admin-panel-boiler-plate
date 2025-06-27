import User from '../models/User';
import type { IUser } from '../types';
import { Types } from 'mongoose';

interface UserData {
  name: string;
  email: string;
  password?: string;
  role: Types.ObjectId;
}

export const createUser = async (userData: UserData): Promise<IUser> => {
  if (await User.findOne({ email: userData.email })) {
    throw new Error('User with this email already exists.');
  }

  const user = new User(userData);
  await user.save();

  const populatedUser = await User.findById(user._id).select('-password').populate({
    path: 'role',
    populate: { path: 'permissions' }
  });

  if (!populatedUser) throw new Error('Failed to create user.');
  return populatedUser;
};

export const getUsers = async (): Promise<IUser[]> => {
  return await User.find().select('-password').populate({
    path: 'role',
    populate: { path: 'permissions' }
  });
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).select('-password').populate({
    path: 'role',
    populate: { path: 'permissions' }
  });
};

export const updateUser = async (id: string, userData: Partial<UserData>): Promise<IUser | null> => {
  delete userData.password; // protect against password overwrite via update
  const user = await User.findByIdAndUpdate(id, userData, { new: true })
    .select('-password')
    .populate({
      path: 'role',
      populate: { path: 'permissions' }
    });
  return user;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};
