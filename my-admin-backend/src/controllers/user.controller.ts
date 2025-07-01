import { Request, Response } from 'express';
import User from '../models/User';
import { isValidObjectId } from 'mongoose';

export const create = async (req: Request, res: Response) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email",
            });
        }

        const user = new User(userData);
        await user.save();

        return res.status(201).json({
            message: "User created successfully",
            user,
        });

    } catch (error: any) {
        return res.status(500).json({
            message: "Error while creating user",
            error: error.message,
          });
    }
};

export const getAll = async (_req: Request, res: Response) => {
    try {
        const users = await User.find().populate('role').exec();
        return res.status(200).json({
            message: "Users fetched!",
            totalUsers: users.length,
            users,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Error while fetching users",
            error: error.message,
          });
    }
};

export const getOne = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
              message: "userId is not valid",
              Id: userId,
            });
          }

        const user = await User.findById(req.params.id).exec();
        if (!user) {
            return res.status(404).json({
              message: "User not found",
            });
          }
        res.status(200).json({
            message: "User fetched!",
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Error while fetching user",
            error: error.message,
          });
    }
};

export const update = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
              message: "userId is not valid",
              Id: userId,
            });
          }

        const user = await User.findByIdAndUpdate(userId, req.body, { new: true }).exec();
        if (!user) {
            return res.status(404).json({
              message: "User not found",
            });
          }
        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Error while updating user",
            error: error.message,
          });
    }
};

export const remove = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
              message: "userId is not valid",
              Id: userId,
            });
          }
        const user = await User.findByIdAndDelete(userId).exec();
        if (!user) {
            return res.status(404).json({
              message: "User not found",
            });
          }
        res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({
            message: "Error while deleting user",
            error: error.message,
          });
    }
};
