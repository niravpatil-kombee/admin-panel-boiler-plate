import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';
import { uploadProductImage } from '../middlewares/upload.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

// Product routes
router.post('/', hasPermission('product:create'), uploadProductImage.single('image'), asyncHandler(productController.createProduct));
router.get('/', hasPermission('product:read'), asyncHandler(productController.getProducts));
router.get('/:id', hasPermission('product:read'), asyncHandler(productController.getProductById));
router.put('/:id', hasPermission('product:update'), asyncHandler(productController.updateProduct));
router.delete('/:id', hasPermission('product:delete'), asyncHandler(productController.deleteProduct));

export default router;
