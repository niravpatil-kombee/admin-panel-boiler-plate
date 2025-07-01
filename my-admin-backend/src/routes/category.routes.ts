import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

router.post('/', hasPermission('category:create'), asyncHandler(categoryController.createCategory));
router.get('/', hasPermission('category:read'), asyncHandler(categoryController.getAll));
router.get('/:id', hasPermission('category:read'), asyncHandler(categoryController.getCategoryById));
router.put('/:id', hasPermission('category:update'), asyncHandler(categoryController.updateCategory));
router.delete('/:id', hasPermission('category:delete'), asyncHandler(categoryController.deleteCategory));

export default router;
