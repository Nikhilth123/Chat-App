import express from 'express'
import { asyncHandler } from '../asyncHandler';
import { authMiddleware } from '../Middlewares/authmiddlewares';
import { previewAttachement,downloadAttachement } from '../Controllers/attachement';
const router=express.Router();
router.get('/:attachementId',authMiddleware,asyncHandler(previewAttachement));
router.get('/:attachementId/download',authMiddleware,asyncHandler(downloadAttachement));

export default router;