import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { IUser } from '../types';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const user = await authService.registerUser({ name, email, password });

        const userResponse = user.toObject?.() || user;
        delete userResponse.password;

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const login = (req: Request, res: Response): Response | void => {
    const user = req.user as IUser | undefined;

    if (!user) {
        return res.status(401).json({ message: 'Login failed' });
    }

    const userResponse = (user.toObject?.() || user) as any;
    delete userResponse.password;

    return res.status(200).json({
        message: "Login successful",
        user: userResponse,
    });
};

export const logout = (req: Request, res: Response): void => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout error' });
        }

        res.clearCookie('connect.sid'); // Optional: only if you’re using cookie-session
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};

export const me = async (req: Request, res: Response) => {
    const user = req.user as IUser | undefined;

    if (!user) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const populatedUser = await User.findById(user._id)
        .select('-password')
        .populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

    if (!populatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: populatedUser });
};
