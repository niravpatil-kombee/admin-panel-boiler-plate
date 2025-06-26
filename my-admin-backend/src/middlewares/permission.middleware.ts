import { Request, Response, NextFunction } from 'express';
import { IPermission } from '../models/Permission';
import { IRole } from '../models/Role';

function isPopulatedPermissionArray(permissions: any): permissions is IPermission[] {
    return Array.isArray(permissions) && permissions.length > 0 && typeof permissions[0].name === 'string';
}

export const hasPermission = (requiredPermission: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required.' });
            return;
        }
        const userRole = (req.user as any).role;
        if (!userRole || !userRole.permissions) {
            res.status(403).json({ message: 'Forbidden: User has no assigned role or permissions.' });
            return;
        }
        const permissions = userRole.permissions;
        let hasPerm = false;
        if (isPopulatedPermissionArray(permissions)) {
            hasPerm = permissions.some((p) => p.name === requiredPermission);
        }
        if (hasPerm) {
            next();
            return;
        }
        res.status(403).json({
            message: `Forbidden: You do not have the required '${requiredPermission}' permission.`,
        });
    };
}; 