import { Message,IMessage} from "../Models/chat";
import { Request, Response } from "express";
import { CustomError } from "../Middlewares/errormiddlewares";
import { getIO } from "../socket/socketInstance";
import {Chat} from "../Models/chat";
export const sendMessage = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const {chatId} = req.params
    const { content } = req.body;
    if (!chatId || !content) {
        throw new CustomError("chatId and content are required", 400);
    }
    console.log("Sending message to chatId:", chatId, "with content:", content);
    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new CustomError("Chat not found", 404);
    }
    if(!loggedInUser){
        throw new CustomError("Unauthorized", 401);
    }

 const status = chat.participants
  .filter(p => p.userId.toString() !== loggedInUser.toString())
  .map(p => ({
    userId: p.userId,
    delivered: false,
    seen: false
  }));
    const newMessage: IMessage = new Message({
        chatId,
        sender: loggedInUser,
        content,
        status:status
    });
    console.log("Created new message object:", newMessage);
    
    await newMessage.save();
   
   const io = getIO();
io.to(chatId).emit("receive_message", {
  _id: newMessage._id,
  chatId: newMessage.chatId,
  sender: newMessage.sender,
  content: newMessage.content,
  createdAt: newMessage.createdAt,
  updatedAt: newMessage.updatedAt,
  status: newMessage.status,
});
    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
    });
}
export const UpdateMessage = async (req: Request, res: Response) => {
    const loggedInUser = req.user!._id;
    const { messageId } = req.params;
    const { content } = req.body;
    if (!messageId || !content) {
        throw new CustomError("messageId and content are required", 400);
    }
    const message = await Message.findById(messageId);
    if (!message) {
        throw new CustomError("Message not found", 404);
    }
    if (message.sender.toString() !== loggedInUser.toString()) {
        throw new CustomError("Unauthorized to update this message", 403);
    }
    message.content = content;
    await message.save();
    res.status(200).json({
        success: true,
        message: "Message updated successfully",
        data: message,
    });
}

export const deleteMessage = async (req: Request, res: Response) => {
    const loggedInUser = req.user!._id;
    const { messageId } = req.params;
    if (!messageId) {
        throw new CustomError("messageId is required", 400);
    }
    const message= await Message.findById(messageId);
    if (!message) {
        throw new CustomError("Message not found", 404);
    }
    if (message.sender.toString() !== loggedInUser.toString()) {
        throw new CustomError("Unauthorized to delete this message", 403);
    }
    await Message.deleteOne({ _id: messageId });
    res.status(200).json({
        success: true,
        message: "Message deleted successfully",
    });
}


export const getAllChatMessages = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { chatId } = req.params;
    if (!chatId) {
        throw new CustomError("chatId is required", 400);
    }
    const messages: Array<IMessage> = await Message.find({ chatId });
    if (messages.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No messages found",
            data: [],
        });
    }
    res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: messages,
    });
}

export const markMessagesAsSeen = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { chatId } = req.params;
    if (!chatId) {
        throw new CustomError("chatId is required", 400);
    }
    const messages: Array<IMessage> = await Message.find({ chatId, seenBy: { $ne: loggedInUser } });
    if (messages.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No unseen messages found",
        });
    }
    await Message.updateMany(
        { chatId, seenBy: { $ne: loggedInUser } },
        { $push: { seenBy: loggedInUser } }
    );
    res.status(200).json({
        success: true,
        message: "Messages marked as seen",
    });
}
