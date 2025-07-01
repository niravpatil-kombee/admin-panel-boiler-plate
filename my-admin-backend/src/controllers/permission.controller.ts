import { Request, Response } from 'express';
import Permission from '../models/Permission';

export const getAll = async (req: Request, res: Response) => {
    try {
      const permissions = await Permission.find().exec();
        res.status(200).json({
            message: "Permissions fetched!",
            totalPermissions: permissions.length,
            permissions,
        });
    } catch (error) {
      res.status(500).json({
        message: "Error in fetch permissions",
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };