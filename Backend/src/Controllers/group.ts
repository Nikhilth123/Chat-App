import { Request, Response } from "express";
import { Chat } from "../Models/chat";
import { CustomError } from "../Middlewares/errormiddlewares";
import mongoose from "mongoose";

// Create Group
export const createGroup = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupName, participantIds } = req.body;
    if (!loggedInUser) {
    throw new CustomError("Unauthorized", 401);
}

    if (!groupName || !Array.isArray(participantIds) || participantIds.length < 2) {
        throw new CustomError("Group name and at least 2 participants are required", 400);
    }

    const uniqueParticipants = [
        ...new Set(
            participantIds.filter((id: string) => id !== loggedInUser.toString())
        ),
    ];

    const groupChat = await Chat.create({
        isGroupChat: true,
        groupName,
        participants: [
            { userId: loggedInUser, status: "accepted" },
            ...uniqueParticipants.map((id: string) => ({
                userId: id,
                status: "pending",
            })),
        ],
        groupAdmin: [loggedInUser],
    });

    res.status(201).json({
        success: true,
        message: "Group created successfully",
        groupChat,
    });
};

// Get Group Details
export const getGroupDetails = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;

    const groupChat = await Chat.findOne({
        _id: groupId,
        isGroupChat: true,
        "participants.userId": loggedInUser,
    })
        .populate("participants.userId", "name userName")
        .populate("groupAdmin", "name userName");

    if (!groupChat) {
        throw new CustomError("Group not found or access denied", 404);
    }

    res.status(200).json({
        success: true,
        groupChat,
    });
};

// Add Participants
export const addGroupParticipants = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
    const { participantIds } = req.body;

    if (!Array.isArray(participantIds) || participantIds.length === 0) {
        throw new CustomError("participantIds are required", 400);
    }

    const groupChat = await Chat.findOne({
        _id: groupId,
        isGroupChat: true,
        groupAdmin: loggedInUser,
    });

    if (!groupChat) {
        throw new CustomError("Group not found or you are not an admin", 404);
    }

    const existingUsers = new Set(
        groupChat.participants.map((p) => p.userId.toString())
    );

    const newParticipants = participantIds
        .filter((id: string) => !existingUsers.has(id))
        .map((id: string) => ({
            userId:  new mongoose.Types.ObjectId(id),
            status: "pending" as const,
        }));

    groupChat.participants.push(...newParticipants);
    await groupChat.save();

    res.status(200).json({
        success: true,
        message: "Participants added successfully",
        groupChat,
    });
};

// Remove Participants
export const removeGroupParticipants = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
    const { participantIds } = req.body;

    if (!Array.isArray(participantIds) || participantIds.length === 0) {
        throw new CustomError("participantIds are required", 400);
    }

    const groupChat = await Chat.findOne({
        _id: groupId,
        isGroupChat: true,
        groupAdmin: loggedInUser,
    });

    if (!groupChat) {
        throw new CustomError("Group not found or you are not an admin", 404);
    }

    groupChat.participants = groupChat.participants.filter(
        (participant) => !participantIds.includes(participant.userId.toString())
    );

    groupChat.groupAdmin = groupChat.groupAdmin!.filter(
        (admin) => !participantIds.includes(admin.toString())
    );

    if (groupChat.groupAdmin.length === 0 && groupChat.participants.length > 0) {
        groupChat.groupAdmin = [groupChat.participants[0].userId];
    }

    await groupChat.save();

    res.status(200).json({
        success: true,
        message: "Participants removed successfully",
        groupChat,
    });
};

// Leave Group
export const leaveGroup = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;
if (!loggedInUser) {
    throw new CustomError("Unauthorized", 401);
}
    const groupChat = await Chat.findOne({
        _id: groupId,
        isGroupChat: true,
        "participants.userId": loggedInUser,
    });

    if (!groupChat) {
        throw new CustomError("Group not found or you are not a participant", 404);
    }

    groupChat.participants = groupChat.participants.filter(
        (participant) =>
            participant.userId.toString() !== loggedInUser.toString()
    );

    groupChat.groupAdmin = groupChat.groupAdmin!.filter(
        (admin) => admin.toString() !== loggedInUser.toString()
    );
 
    if (groupChat.participants.length === 0) {
        await Chat.findByIdAndDelete(groupId);

        return res.status(200).json({
            success: true,
            message: "Group deleted as no participants remain",
        });
    }

    if (groupChat.groupAdmin.length === 0) {
        groupChat.groupAdmin = [groupChat.participants[0].userId];
    }

    await groupChat.save();

    res.status(200).json({
        success: true,
        message: "Left group successfully",
        groupChat,
    });
};

// Delete Group
export const deleteGroup = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupId } = req.params;

    const groupChat = await Chat.findOne({
        _id: groupId,
        isGroupChat: true,
        groupAdmin: loggedInUser,
    });

    if (!groupChat) {
        throw new CustomError("Group not found or you are not an admin", 404);
    }

    await Chat.findByIdAndDelete(groupId);

    res.status(200).json({
        success: true,
        message: "Group deleted successfully",
    });
};