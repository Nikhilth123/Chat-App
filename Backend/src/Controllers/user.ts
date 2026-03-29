import { User } from "../Models/user";
import { Request,Response } from "express";
import { CustomError } from "../Middlewares/errormiddlewares";
export async function getuser(req:Request,res:Response){
    console.log("here bro ");
            const searchstring=req.query.query as string;
            console.log("search string is :",searchstring);
            if(!searchstring){
                throw new CustomError('search query is required',400);
            }
            const users=await User.find({
                username:{$regex:searchstring,$options:'i'}
            });
            return res.status(200).json({
                success:true,
                message:"searched user fetched successfully",
                users,
            })
}