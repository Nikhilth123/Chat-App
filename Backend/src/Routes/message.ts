import express from "express";
import { getAllChatMessages,sendMessage
    ,UpdateMessage,deleteMessage,markMessagesAsSeen} from "../Controllers/message";
import { authMiddleware } from "../Middlewares/authmiddlewares";
import { asyncHandler } from "../asyncHandler";

const router = express.Router();

router.post("/:chatId/send", authMiddleware, asyncHandler(sendMessage));

router.get("/:chatId", authMiddleware, asyncHandler(getAllChatMessages));
router.put("/:messageId", authMiddleware, asyncHandler(UpdateMessage));

router.post("/chat/:chatId/mark-seen", authMiddleware, asyncHandler(markMessagesAsSeen));

export default router;