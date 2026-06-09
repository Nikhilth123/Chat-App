import express from 'express'
import { authMiddleware } from '../Middlewares/authmiddlewares';
import { asyncHandler } from '../asyncHandler';
import { createpost } from '../Controllers/posts';
import { upload } from '../Config/multer';
const router =express.Router();
router.post('/createpost', authMiddleware, upload.array('images',10), asyncHandler(createpost));