import { Post } from "../Models/posts";
import { Request, Response } from "express";
import { CustomError } from "../Middlewares/errormiddlewares";
export const createpost=async(req:Request,res:Response)=>{
    const {content,mediaUrl}=req.body;
    const userId=req.user?._id;
    const files=req.files as Express.Multer.File[];
    mediaUrl.push(...files.map((file) => file.path));
    if(!content&&!mediaUrl){
        throw new CustomError("Post cannot be empty",400);
    }
    const post=await Post.create({
        userId,
        content,
        likescount:0,
        mediaUrl
    });
    res.status(201).json({message:"Post created successfully",post});
}
