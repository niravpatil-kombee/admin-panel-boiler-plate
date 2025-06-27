import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

router.post('/', hasPermission('brand:create'), asyncHandler(brandController.createBrand));
router.get('/', hasPermission('brand:read'), asyncHandler(brandController.getBrands));
router.get('/:id', hasPermission('brand:read'), asyncHandler(brandController.getBrandById));
router.put('/:id', hasPermission('brand:update'), asyncHandler(brandController.updateBrand));
router.delete('/:id', hasPermission('brand:delete'), asyncHandler(brandController.deleteBrand));

export default router;
