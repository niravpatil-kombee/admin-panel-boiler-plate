import { Router } from 'express';
import * as warehouseController from '../controllers/warehouse.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

router.post('/', hasPermission('warehouse:create'), asyncHandler(warehouseController.createWarehouse));
router.get('/', hasPermission('warehouse:read'), asyncHandler(warehouseController.getWarehouses));
router.get('/:id', hasPermission('warehouse:read'), asyncHandler(warehouseController.getWarehouseById));
router.put('/:id', hasPermission('warehouse:update'), asyncHandler(warehouseController.updateWarehouse));
router.delete('/:id', hasPermission('warehouse:delete'), asyncHandler(warehouseController.deleteWarehouse));

export default router; 