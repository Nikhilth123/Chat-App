import { Request, Response } from "express";
import {Chat,IChat } from "../Models/chat";
import { CustomError } from "../Middlewares/errormiddlewares";



export const CreatGroup=async(req:Request,res:Response)=>{
    const loggedInUser = req.user?._id;
    const { groupName, participantIds } = req.body;
    if (!groupName || !participantIds || participantIds.length < 2) {
        throw new CustomError("groupName and at least 2 participantIds are required", 400);
    }
    const newGroupChat = new Chat({
        isGroupChat: true,
        groupName,
        participants: [{ Userid: loggedInUser, status: "accepted" }, ...participantIds.map((id: string) => ({ Userid: id, status: "pending" }))],
        groupAdmin: loggedInUser,
    });
    res.status(200).json({
        success: true,
        message: "Group chat created successfully",
        groupChat: newGroupChat,
    });
}