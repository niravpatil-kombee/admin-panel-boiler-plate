import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import passport from 'passport';
import User, { IUser } from '../models/User';
import { generateAccessToken, verifyToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }
        const user = await authService.registerUser({ name, email, password });
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = (req: Request, res: Response) => {
    const user = req.user as IUser;
    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
    authService.loginUser(user)
        .then(({ accessToken, refreshToken, user }) => {
            const userResponse = user.toObject();
            delete userResponse.password;
            delete userResponse.refreshToken;
            res.json({
                message: "Login successful",
                accessToken,
                refreshToken,
                user: userResponse
            });
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred during login.', error: error.message });
        });
};

export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'Refresh token is required.' });
    }
    const decoded = verifyToken(token, true);
    if (!decoded) {
        return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
    const user = await User.findById(decoded.id).populate('role') as IUser | null;
    if (!user || user.refreshToken !== token) {
        return res.status(403).json({ message: 'Refresh token is not valid.' });
    }
    const tokenPayload = { id: (user._id as any).toString(), role: (user.role as any).name };
    const accessToken = generateAccessToken(tokenPayload);
    res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    if (!user) {
        return res.status(401).json({ message: "Not authorized." });
    }
    try {
        await authService.logoutUser((user._id as any).toString());
        res.status(200).json({ message: 'Successfully logged out.' });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred during logout." });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const user = await User.findById(userId)
            .select('-password -refreshToken')
            .populate({
                path: 'role',
                populate: { path: 'permissions' }
            });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch user info.' });
    }
}; 