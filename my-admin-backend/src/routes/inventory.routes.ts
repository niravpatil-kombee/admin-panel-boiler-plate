import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

router.post('/', hasPermission('inventory:create'), asyncHandler(inventoryController.createInventory));
router.get('/', hasPermission('inventory:read'), asyncHandler(inventoryController.getInventories));
router.get('/:id', hasPermission('inventory:read'), asyncHandler(inventoryController.getInventoryById));
router.put('/:id', hasPermission('inventory:update'), asyncHandler(inventoryController.updateInventory));
router.delete('/:id', hasPermission('inventory:delete'), asyncHandler(inventoryController.deleteInventory));

export default router; 