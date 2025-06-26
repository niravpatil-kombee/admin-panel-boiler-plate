import User, { IUser } from '../models/User';
import Role from '../models/Role';
import { Error } from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

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
    const user = new User({
        name,
        email,
        password,
        role: defaultRole._id,
    });
    await user.save();
    const newUser = await User.findById(user._id).populate({
        path: 'role',
        populate: { path: 'permissions' }
    });
    if(!newUser) throw new Error('Failed to create user.');
    return newUser;
};

export const loginUser = async (user: IUser): Promise<{ accessToken: string; refreshToken: string; user: IUser }> => {
    const tokenPayload = { id: (user._id as any).toString(), role: (user.role as any).name };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    const loggedInUser = await User.findById(user._id).populate({
        path: 'role',
        populate: { path: 'permissions' }
    });
    if (!loggedInUser) throw new Error('User not found after login.');
    return { accessToken, refreshToken, user: loggedInUser as IUser };
};

export const logoutUser = async (userId: string): Promise<void> => {
    const user = await User.findById(userId).populate({
        path: 'role',
        populate: { path: 'permissions' }
    });
    if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
    }
}; 