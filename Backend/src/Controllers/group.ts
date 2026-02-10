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

export const getGroupmessages = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
    if (!groupId) {
        throw new CustomError("groupId is required", 400);
    }
    const groupChat = await Chat.findOne({ _id: groupId, isGroupChat: true, "participants.Userid": loggedInUser });
    if (!groupChat) {
        throw new CustomError("Group chat not found or you are not a participant", 404);
    }
    res.status(200).json({
        success: true,
        message: "Group chat details retrieved successfully",
        groupChat,
    });
}

export const addGroupParticipants = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
    const { participantIds } = req.body;
    if (!groupId || !participantIds || participantIds.length === 0) {
        throw new CustomError("groupId and participantIds are required", 400);
    }
    const groupChat = await Chat.findOne({ _id: groupId, isGroupChat: true, groupAdmin: loggedInUser });
    if (!groupChat) {
        throw new CustomError("Group chat not found or you are not the admin", 404);
    }
    const newParticipants = participantIds.map((id: string) => ({ Userid: id, status: "pending" }));
    groupChat.participants.push(...newParticipants);
    await groupChat.save();
    res.status(200).json({
        success: true,
        message: "Participants added successfully",
        groupChat,
    });
}

export const removeGroupParticipants = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
    const { participantIds } = req.body;
    if (!groupId || !participantIds || participantIds.length === 0) {
        throw new CustomError("groupId and participantIds are required", 400);
    }
    const groupChat = await Chat.findOne({ _id: groupId, isGroupChat: true, groupAdmin: loggedInUser });
    if (!groupChat) {
        throw new CustomError("Group chat not found or you are not the admin", 404);
    }
    groupChat.participants = groupChat.participants.filter(participant => !participantIds.includes(participant.Userid.toString()));
    await groupChat.save();
    res.status(200).json({
        success: true,
        message: "Participants removed successfully",
        groupChat,
    });
}

export const leaveGroup = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
    if (!groupId) {
        throw new CustomError("groupId is required", 400);
    }
    const groupChat = await Chat.findOne({ _id: groupId, isGroupChat: true, "participants.Userid": loggedInUser });
    if (!groupChat) {
        throw new CustomError("Group chat not found or you are not a participant", 404);
    }
    groupChat.participants = groupChat.participants.filter(participant => participant.Userid.toString() !== loggedInUser.toString());
    if (groupChat.participants.length === 0) {
        await Chat.deleteOne({ _id
: groupId });
        return res.status(200).json({
            success: true,
            message: "You left the group and the group has been deleted as there are no more participants",
        });
    }
    if (groupChat.groupAdmin === loggedInUser) {
        groupChat.groupAdmin = groupChat.participants[0].Userid;
    }
    await groupChat.save();
    res.status(200).json({
        success: true,
        message: "You left the group successfully",
        groupChat,
    });

}

export const deleteGroup = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
    if (!groupId) {
        throw new CustomError("groupId is required", 400);
    }
    const groupChat = await Chat.findOne({ _id: groupId, isGroupChat: true, groupAdmin: loggedInUser });
    if (!groupChat) {
        throw new CustomError("Group chat not found or you are not the admin", 404);
    }
    await Chat.deleteOne({ _id: groupId });
    res.status(200).json({
        success: true,
        message: "Group chat deleted successfully",
    });
}

