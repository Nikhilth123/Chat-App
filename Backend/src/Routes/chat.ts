import express from "express";
import { createChat, getUserChats } from "../Controllers/chat";
import { authMiddleware } from "../Middlewares/authmiddlewares";
import { asyncHandler } from "../asyncHandler";
const router = express.Router();

router.post("/create/:userId", authMiddleware, asyncHandler(createChat));

router.get("/my-chats", authMiddleware, asyncHandler(getUserChats));
export default router;