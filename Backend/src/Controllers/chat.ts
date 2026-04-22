import { Request, Response } from "express";
import {Chat, IChat } from "../Models/chat";
import mongoose from "mongoose";
import { CustomError } from "../Middlewares/errormiddlewares";
interface CreateChatParams extends Response{
  userId: string;
}
interface FormattedUser{
    id:string,
    name:string,
    email:string,
    profilepic?:string
}
interface Formattedchats{
    _id:string,
    participants:{
    user:FormattedUser,
    status:string,
    }[],
    lastmessage:string
}
export const createChat = async (req: Request, res: Response) => {
    const loggedinUserId= req.user?._id;
    const otherUserId  =  new mongoose.Types.ObjectId(req.params.userId as string);
    if (!otherUserId) {
        throw new CustomError(" otherUserId is  required", 400);
    }
    const existingChat = await Chat.findOne({
  isGroupChat: false,
  $and: [
    { participants: { $elemMatch: { userId: loggedinUserId } } },
    { participants: { $elemMatch: { userId: otherUserId } } }
  ]
});

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


export const getuserallchats=async(req:Request,res:Response)=>{
        const userid=req.user?._id;
        if(!userid){
            return new CustomError("unathorized",401);
        }
        const userchats = await Chat.aggregate([
  {
    $match: {
      isGroupChat: false,
      "participants.userId": userid,
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "participants.userId",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  {
    $addFields: {
      participants: {
        $map: {
          input: "$participants",
          as: "p",
          in: {
            status: "$$p.status",
            user: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$userDetails",
                    as: "u",
                    cond: { $eq: ["$$u._id", "$$p.userId"] }
                  }
                },
                0
              ]
            }
          }
        }
      }
    }
  },
  {
    $project: {
      "participants.user.password": 0,
      userDetails: 0
    }
  }
]);

        const formattedchat:Formattedchats[]=userchats.map((chat):Formattedchats=>({
            _id:chat._id,
            participants:chat.participants,
            lastmessage:chat.lastMessage,
        }))
        return res.status(201).json({
            chats:formattedchat,
            message:"chat fetched successfully",
        })
}