import { Router } from 'express';
import * as collectionController from '../controllers/collection.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { hasPermission } from '../middlewares/permission.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

router.post('/', hasPermission('collection:create'), asyncHandler(collectionController.createCollection));
router.get('/', hasPermission('collection:read'), asyncHandler(collectionController.getCollections));
router.get('/:id', hasPermission('collection:read'), asyncHandler(collectionController.getCollectionById));
router.put('/:id', hasPermission('collection:update'), asyncHandler(collectionController.updateCollection));
router.delete('/:id', hasPermission('collection:delete'), asyncHandler(collectionController.deleteCollection));

export default router;
