import { Router } from 'express';
import * as roleController from '../controllers/role.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(isAuthenticated);

router.post('/', hasPermission('role:create'), asyncHandler(roleController.create));
router.get('/', hasPermission('role:read'), asyncHandler(roleController.getAll));
router.get('/:id', hasPermission('role:read'), asyncHandler(roleController.getOne));
router.put('/:id', hasPermission('role:update'), asyncHandler(roleController.update));
router.delete('/:id', hasPermission('role:delete'), asyncHandler(roleController.remove));

export default router; 