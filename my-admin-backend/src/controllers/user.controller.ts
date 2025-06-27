import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const create = async (req: Request, res: Response) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is required for new users." });
        }
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAll = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        return res.status(200).json(users);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching users.' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ message: 'Error deleting user.' });
    }
};
