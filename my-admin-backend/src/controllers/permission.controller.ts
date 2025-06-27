import { Request, Response } from 'express';
import * as permissionService from '../services/permission.service';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const permissions = await permissionService.getPermissions();
        return res.status(200).json(permissions);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching permissions' });
    }
};
