import User from '../models/User';
import type { IUser } from '../types';
import Role from '../models/Role';

interface UserData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (userData: UserData): Promise<IUser> => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const defaultRole = await Role.findOne({ name: 'Viewer' });
  if (!defaultRole) {
    throw new Error('Default role not found. Please run the seeder.');
  }

  const user = new User({ name, email, password, role: defaultRole._id });
  await user.save();

  const newUser = await User.findById(user._id).populate({
    path: 'role',
    populate: { path: 'permissions' }
  });

  if (!newUser) throw new Error('Failed to create user.');
  return newUser;
};

export const loginUser = async (user: IUser): Promise<IUser> => {
  const loggedInUser = await User.findById(user._id).populate({
    path: 'role',
    populate: { path: 'permissions' }
  });

  if (!loggedInUser) throw new Error('User not found after login.');
  return loggedInUser;
};
