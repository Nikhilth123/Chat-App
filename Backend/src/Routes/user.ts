import { getuser } from "../Controllers/user";
import  express from "express";
import { authMiddleware } from "../Middlewares/authmiddlewares";
import { asyncHandler } from "../asyncHandler";
import { getuserprofile } from "../Controllers/user";
const router=express.Router();
router.get('/search',authMiddleware,asyncHandler(getuser));
router.get('/me',authMiddleware,asyncHandler(getuserprofile));
export default router;