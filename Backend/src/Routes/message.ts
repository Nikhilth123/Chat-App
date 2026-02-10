import express from "express";
import { getAllChatMessages,sendMessage
    ,UpdateMessage,deleteMessage,markMessagesAsSeen} from "../Controllers/message";
import { authMiddleware } from "../Middlewares/authmiddlewares";
import { asyncHandler } from "../asyncHandler";

const router = express.Router();

router.post("/send", authMiddleware, asyncHandler(sendMessage));

router.get("/cha)t/:chatId/messages", authMiddleware, asyncHandler(getAllChatMessages));
router.put("/message/:messageId", authMiddleware, asyncHandler(UpdateMessage));

router.post("/chat/:chatId/mark-seen", authMiddleware, asyncHandler(markMessagesAsSeen));

export default router;