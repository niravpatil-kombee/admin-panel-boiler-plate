import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();

// Helper to wrap async route handlers and forward errors
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(isAuthenticated);

router.post('/', hasPermission('user:create'), asyncHandler(userController.create));
router.get('/', hasPermission('user:read'), asyncHandler(userController.getAll));
router.get('/:id', hasPermission('user:read'), asyncHandler(userController.getOne));
router.put('/:id', hasPermission('user:update'), asyncHandler(userController.update));
router.delete('/:id', hasPermission('user:delete'), asyncHandler(userController.remove));

export default router; 