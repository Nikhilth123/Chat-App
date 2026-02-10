import { Request, Response } from "express";
import {Chat, IChat } from "../Models/chat";

import { CustomError } from "../Middlewares/errormiddlewares";

export const createChat = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const{otherUserId } = req.body;
    if (!otherUserId) {
        throw new CustomError(" otherUserId is  required", 400);
    }


    const existingChat = await Chat.findOne({
        isGroupChat: false,
        "participants.Userid":{ $all: [loggedInUser, otherUserId] },
    });
    if (existingChat) {
        return res.status(200).json({
            success: true,
            message: "Chat already exists",
            chat: existingChat,
        });
    }
    const newChat:IChat = new Chat({
        isGroupChat: false,
        participants: [{Userid:loggedInUser, status: "accepted" },{Userid:otherUserId, status: "pending" }],
    });
    await newChat.save();
    res.status(201).json({
        success: true,
        message: "Chat created successfully",
        chat: newChat,
    });
}

export const getUserChats = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const chats:Array<IChat> = await Chat.find({
        isGroupChat: false,
        "participants.Userid": loggedInUser,
    });
    if(chats.length===0){
        return res.status(200).json({
            success: true,
            message: "No chats found",
            chats: [],
        });
    }
    res.status(200).json({
        success: true,
        message: "Chats retrieved successfully",
        chats: chats,
    });
}
