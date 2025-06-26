import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import passport from 'passport';
import User, { IUser } from '../models/User';


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

export const login = (req: Request, res: Response): void => {
    const user = req.user as any;
    if (!user) {
        res.status(401).json({ message: 'Login failed' });
        return;
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({
        message: "Login successful",
        user: userResponse
    });
};

export const logout = (req: Request, res: Response): void => {
    req.logout((err) => {
        if (err) {
            res.status(500).json({ message: 'Logout error' });
            return;
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

export const me = (req: Request, res: Response): void => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'Not logged in' });
        return;
    }
    res.json({ user });
};