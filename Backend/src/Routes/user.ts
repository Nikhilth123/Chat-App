import { getuser } from "../Controllers/user";
import  express from "express";
import { authMiddleware } from "../Middlewares/authmiddlewares";
import { asyncHandler } from "../asyncHandler";

const router=express.Router();
router.get('/search',authMiddleware,asyncHandler(getuser));
export default router;