import express from "express";
import * as attributecontroller from "../controllers/attribute.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { hasPermission } from '../middlewares/permission.middleware';
import { uploadProductImage } from "../middlewares/upload.middleware";


const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(isAuthenticated);

router.post('/', uploadProductImage, hasPermission('attribute:create'), asyncHandler(attributecontroller.createAttribute));
router.get('/', hasPermission('attribute:read'), asyncHandler(attributecontroller.getAttributes));
router.get('/:id', hasPermission('attribute:read'), asyncHandler(attributecontroller.getAttributeById));
router.put('/:id', uploadProductImage, hasPermission('attribute:update'), asyncHandler(attributecontroller.updateAttribute));
router.delete('/:id', hasPermission('attribute:delete'), asyncHandler(attributecontroller.deleteAttribute));

export default router;
