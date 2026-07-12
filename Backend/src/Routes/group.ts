import express from "express";
import { asyncHandler } from "../asyncHandler";
import { authMiddleware } from "../Middlewares/authmiddlewares";
import { createGroup } from "../Controllers/group";
const router=express.Router();
router.post('/creategroup',authMiddleware,asyncHandler(createGroup))
router.get('/grouplist',asyncHandler())