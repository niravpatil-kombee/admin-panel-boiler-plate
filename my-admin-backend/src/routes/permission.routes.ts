import { Router } from 'express';
import * as permissionController from '../controllers/permission.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();

router.get(
    '/',
    isAuthenticated,
    hasPermission('role:read'),
    permissionController.getAll
);

export default router; 