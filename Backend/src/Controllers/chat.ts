import { Request, Response } from "express";
import {Chat, IChat } from "../Models/chat";
import mongoose from "mongoose";
import { CustomError } from "../Middlewares/errormiddlewares";
interface CreateChatParams {
  userId: string;
}

export const createChat = async (req: Request<CreateChatParams>, res: Response) => {
    const loggedinUserId= req.user?._id;
    const otherUserId  =  new mongoose.Types.ObjectId(req.params.userId);
    if (!otherUserId) {
        throw new CustomError(" otherUserId is  required", 400);
    }
    const existingChat = await Chat.findOne({
  isGroupChat: false,
  $and: [
    { participants: { $elemMatch: { userId: loggedinUserId } } },
    { participants: { $elemMatch: { userId: otherUserId } } }
  ]
}).populate("userId","userName");

console.log("existing chat:",existingChat);

    if (existingChat) {
        return res.status(200).json({
            success: true,
            message: "Chat already exists",
            chat: existingChat,
        });
    }
    const newChat:IChat = new Chat({
        isGroupChat: false,
        participants: [{userId:loggedinUserId, status: "accepted" },{userId:otherUserId, status: "pending" }],
    });
    await newChat.save();
    console.log("nerw chat:",newChat);
    res.status(201).json({
        success: true,
        message: "Chat created successfully",
        chat: newChat,
    });
}

export const getUserChats = async (req: Request, res: Response) => {
    const loggedinUserId = req.user?._id;
    const chats:Array<IChat> = await Chat.find({
        isGroupChat: false,
        "participants.userId":loggedinUserId,
    }).populate("participants.userId","userName");
    console.log("user chat:",chats);
    if(chats.length===0){
        return res.status(200).json({
            success: true,
            message: "No chats found",
            chats: [],
        });
    }
 return res.status(200).json({
        success: true,
        message: "Chats retrieved successfully",
        chats: chats,
    });
}
