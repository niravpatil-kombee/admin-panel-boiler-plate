import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

router.post('/', hasPermission('product:create'), asyncHandler(productController.create));
router.get('/', hasPermission('product:read'), asyncHandler(productController.getAll));
router.get('/:id', hasPermission('product:read'), asyncHandler(productController.getOne));
router.put('/:id', hasPermission('product:update'), asyncHandler(productController.update));
router.delete('/:id', hasPermission('product:delete'), asyncHandler(productController.remove));

export default router;
