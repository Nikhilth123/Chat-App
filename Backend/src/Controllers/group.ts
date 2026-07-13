import { Request, Response } from "express";
import { Chat } from "../Models/chat";
import { CustomError } from "../Middlewares/errormiddlewares";
import mongoose from "mongoose";
import { Message,IMessage } from "../Models/chat";
import { getIO } from "../socket/socketInstance";
import { User } from "../Models/user";
// Create Group
export const createGroup = async (req: Request, res: Response) => {
    const loggedInUser = req.user?._id;
    const { groupName, participantIds } = req.body;
    console.log('request received for group creating ')
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

     const status = groupChat.participants
  .filter(p => p.userId.toString() !== loggedInUser.toString())
  .map(p => ({
    userId: p.userId,
    delivered: false,
    seen: false
  }));
        const newMessage: IMessage = new Message({
            chatId:groupChat._id,
            systemmessage:true,
            content:`group created on ${Date.now()}`,
            attachements:[],
            status:status
        });
        console.log("Created new message object:", newMessage);
        
        await newMessage.save();
       
       const io = getIO();
       const gid=groupChat._id.toString();
    io.to(gid).emit("receive_message", {
      _id: newMessage._id,
      chatId: newMessage.chatId,
      sender: newMessage.sender,
      systemmessage:newMessage.systemmessage,
      content: newMessage.content,
      attachements:[],
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
      status: newMessage.status,
    });

    res.status(201).json({
        success: true,
        message: "Group created successfully",
        group:groupChat,
    });
};
//Get all group list of user
export const getuserAllGroups = async (req: Request, res: Response) => {
    const id = req.user?._id;

    if (!id) {
        throw new CustomError("Unauthorized", 401);
    }

    const userGroups = await Chat.find({
        isGroupChat: true,
        "participants.userId": id,
    })
    .populate("participants.userId", "userName")
    .populate("groupAdmin", "userName")
    .sort({ updatedAt: -1 });

    const transformedGroups = userGroups.map((group) => ({
  ...group.toObject(),
  participants: group.participants.map((participant) => ({
    user: participant.userId,
    status: participant.status,
  })),
}));

    res.status(200).json({
        success: true,
        groups: transformedGroups,
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
  if(!loggedInUser){
    throw new CustomError("unathorised user",400);
  }

  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    throw new CustomError("participantIds are required", 400);
  }

  const groupChat = await Chat.findOne({
    _id: groupId,
    isGroupChat: true,
    groupAdmin: loggedInUser,
  });

  if (!groupChat) {
    throw new CustomError(
      "Group not found or you are not an admin",
      404
    );
  }

  // Existing participant ids
  const existingUsers = new Set(
    groupChat.participants.map((p) => p.userId.toString())
  );

  // Remove duplicates from request and ignore already existing users
  const uniqueParticipantIds = [...new Set(participantIds)];

  const newParticipants = uniqueParticipantIds
    .filter((id: string) => !existingUsers.has(id))
    .map((id: string) => ({
      userId: new mongoose.Types.ObjectId(id),
      status: "pending" as const,
    }));

  if (newParticipants.length === 0) {
    throw new CustomError("All selected users are already in the group", 400);
  }

  groupChat.participants.push(...newParticipants);
  await groupChat.save();

  const updatedGroup = await Chat.findById(groupId)
    .populate("participants.userId", "name userName")
    .populate("groupAdmin", "name userName");

  if (!updatedGroup) {
    throw new CustomError("Group not found", 404);
  }

  const transformedGroup = {
    ...updatedGroup.toObject(),
    participants: updatedGroup.participants.map((participant) => ({
      user: participant.userId,
      status: participant.status,
    })),
  };

  const populatedUsers = await User.find(
  {
    _id: { $in: uniqueParticipantIds },
  },
  "name"
);

const addedNames = populatedUsers.map((u) => u.name);

let newcontent = "";

     const newstatus = updatedGroup.participants
  .filter(p => p.userId.toString() !== loggedInUser.toString())
  .map(p => ({
    userId: p.userId,
    delivered: false,
    seen: false
  }));

if (addedNames.length === 1) {
  newcontent = `${req.user?.name} added ${addedNames[0]} to the group`;
} else if (addedNames.length === 2) {
  newcontent = `${req.user?.name} added ${addedNames[0]} and ${addedNames[1]} to the group`;
} else {
  newcontent = `${req.user?.name} added ${addedNames[0]}, ${addedNames[1]} and ${
    addedNames.length - 2
  } others to the group`;
}
 const newMessage: IMessage = new Message({
            chatId:groupChat._id,
            systemmessage:true,
            content:newcontent,
            attachements:[],
            status:newstatus
        });
        console.log("Created new message object:", newMessage);
        
        await newMessage.save();
       
       const io = getIO();
       const gid=groupChat._id.toString();
    io.to(gid).emit("receive_message", {
      _id: newMessage._id,
      chatId: newMessage.chatId,
      sender: newMessage.sender,
      systemmessage:newMessage.systemmessage,
      content: newMessage.content,
      attachements:[],
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
      status: newMessage.status,
    });

  

  return res.status(200).json({
    success: true,
    message: "Participants added successfully",
    group: transformedGroup,
  });
};
export const leaveGroup = async (req: Request, res: Response) => {
  const loggedInUser = req.user?._id;
  const { groupId } = req.params;
  const { userId: userToRemove } = req.body;

  if (!loggedInUser || !req.user) {
    throw new CustomError("Unauthorized", 401);
  }

  const groupChat = await Chat.findOne({
    _id: groupId,
    isGroupChat: true,
    "participants.userId": loggedInUser,
  });

  if (!groupChat) {
    throw new CustomError(
      "Group not found or you are not a participant",
      404
    );
  }

  let content = "";

  // ===========================
  // USER LEAVES GROUP
  // ===========================
  if (!userToRemove) {
    content = `${req.user.userName} left the group`;

    groupChat.participants = groupChat.participants.filter(
      (p) => p.userId.toString() !== loggedInUser.toString()
    );

    groupChat.groupAdmin = groupChat.groupAdmin!.filter(
      (admin) => admin.toString() !== loggedInUser.toString()
    );

    // Assign new admin if needed
    if (
      groupChat.groupAdmin.length === 0 &&
      groupChat.participants.length > 0
    ) {
      groupChat.groupAdmin = [groupChat.participants[0].userId];
    }
  }

  // ===========================
  // ADMIN REMOVES MEMBER
  // ===========================
  else {
    // Admin cannot remove himself using this endpoint
    if (userToRemove.toString() === loggedInUser.toString()) {
      throw new CustomError(
        "Use leave group to remove yourself.",
        400
      );
    }

    const isAdmin = groupChat.groupAdmin!.some(
      (admin) => admin.toString() === loggedInUser.toString()
    );

    if (!isAdmin) {
      throw new CustomError("Only admins can remove members.", 403);
    }

    const participant = groupChat.participants.find(
      (p) => p.userId.toString() === userToRemove.toString()
    );

    if (!participant) {
      throw new CustomError(
        "User is not a participant of this group.",
        400
      );
    }

    const removedUser = await User.findById(userToRemove);

    if (!removedUser) {
      throw new CustomError("User not found.", 404);
    }

    content = `${req.user.userName} removed ${removedUser.userName}`;

    groupChat.participants = groupChat.participants.filter(
      (p) => p.userId.toString() !== userToRemove.toString()
    );

    groupChat.groupAdmin = groupChat.groupAdmin!.filter(
      (admin) => admin.toString() !== userToRemove.toString()
    );

    // If removed user was the last admin
    if (
      groupChat.groupAdmin.length === 0 &&
      groupChat.participants.length > 0
    ) {
      groupChat.groupAdmin = [groupChat.participants[0].userId];
    }
  }

  // If nobody is left, delete the group (optional)
  // if (groupChat.participants.length === 0) {
  //   await Chat.findByIdAndDelete(groupId);
  //   return res.status(200).json({
  //     success: true,
  //     message: "Group deleted successfully",
  //   });
  // }

  const newStatus = groupChat.participants.map((p) => ({
    userId: p.userId,
    delivered: false,
    seen: false,
  }));

  const newMessage: IMessage = new Message({
    chatId: groupChat._id,
    systemmessage: true,
    content,
    attachements: [],
    status: newStatus,
  });

  await groupChat.save();
  await newMessage.save();

  const io = getIO();

  io.to(groupChat._id.toString()).emit("receive_message", {
    _id: newMessage._id,
    chatId: newMessage.chatId,
    sender: newMessage.sender,
    systemmessage: newMessage.systemmessage,
    content: newMessage.content,
    attachements: [],
    createdAt: newMessage.createdAt,
    updatedAt: newMessage.updatedAt,
    status: newMessage.status,
  });

   const updatedGroup = await Chat.findById(groupId)
    .populate("participants.userId", "name userName")
    .populate("groupAdmin", "name userName");

  if (!updatedGroup) {
    throw new CustomError("Group not found", 404);
  }

  const transformedGroup = {
    ...updatedGroup.toObject(),
    participants: updatedGroup.participants.map((participant) => ({
      user: participant.userId,
      status: participant.status,
    })),
  };

  res.status(200).json({
    success: true,
    message: userToRemove
      ? "User removed successfully"
      : "Left group successfully",
    group:transformedGroup,
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

export const makeadmin=async(req:Request,res:Response)=>{
  const loggedInUser=req.user?._id;
  const {groupId}=req?.params;
  const {userId}=req.body;
  if(!userId){
    throw new CustomError('candidate admin userid required',401);
  }
  if(!groupId){
    throw new CustomError('groupId is  required',401);
  }
  if(!loggedInUser){
    throw new CustomError('unathorised',404);
  }
  const group=await Chat.findById(groupId);
  if(!group){
    throw new CustomError('group not found',404);
  }
  const admin=group.groupAdmin;
  let isadmin=false;
  for(let i=0;i<admin!.length;i++){
    if(admin![i]._id.toString()==loggedInUser.toString())isadmin=true;
  }
  if(!isadmin){
    throw new CustomError('logged in user in not admin',401);
  }
let isparticipant=false;
for(let i=0;i<group.participants.length;i++){
    if(group.participants[i].userId.toString()==userId.toString())isparticipant=true;
  }
  if(!isparticipant){
    throw new CustomError('other user is not participant of group',401);
  }
group.groupAdmin!.push(userId);
group.save();
 const updatedGroup = await Chat.findById(groupId)
    .populate("participants.userId", "name userName")
    .populate("groupAdmin", "name userName");

  if (!updatedGroup) {
    throw new CustomError("Group not found", 404);
  }

  const transformedGroup = {
    ...updatedGroup.toObject(),
    participants: updatedGroup.participants.map((participant) => ({
      user: participant.userId,
      status: participant.status,
    })),
  };

  return res.status(200).json({
    success:true,
    msg:'admin made sucessfullyy',
    group:transformedGroup
  })

}

export const removeAdmin = async (req: Request, res: Response) => {
  const loggedInUser = req.user?._id;
  const { groupId } = req.params;
  const { userId } = req.body;

  if (!loggedInUser) {
    throw new CustomError("Unauthorized", 401);
  }

  if (!groupId) {
    throw new CustomError("Group ID is required", 400);
  }

  if (!userId) {
    throw new CustomError("User ID is required", 400);
  }

  const group = await Chat.findById(groupId);

  if (!group || !group.isGroupChat) {
    throw new CustomError("Group not found", 404);
  }

  // Logged in user must be admin
  const isAdmin = group.groupAdmin!.some(
    (admin) => admin.toString() === loggedInUser.toString()
  );

  if (!isAdmin) {
    throw new CustomError("Only admins can remove admins", 403);
  }

  // Target user must be participant
  const isParticipant = group.participants.some(
    (p) => p.userId.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new CustomError("User is not a participant", 400);
  }

  // Target user must already be admin
  const targetIsAdmin = group.groupAdmin!.some(
    (admin) => admin.toString() === userId.toString()
  );

  if (!targetIsAdmin) {
    throw new CustomError("User is not an admin", 400);
  }

  // Don't remove the last admin
  if (group.groupAdmin!.length === 1) {
    throw new CustomError(
      "Group must have at least one admin",
      400
    );
  }

  group.groupAdmin = group.groupAdmin!.filter(
    (admin) => admin.toString() !== userId.toString()
  );

  await group.save();

  const updatedGroup = await Chat.findById(groupId)
    .populate("participants.userId", "name userName")
    .populate("groupAdmin", "name userName");

  if (!updatedGroup) {
    throw new CustomError("Group not found", 404);
  }

  const transformedGroup = {
    ...updatedGroup.toObject(),
    participants: updatedGroup.participants.map((participant) => ({
      user: participant.userId,
      status: participant.status,
    })),
  };

  return res.status(200).json({
    success: true,
    message: "Admin removed successfully",
    group: transformedGroup,
  });
};