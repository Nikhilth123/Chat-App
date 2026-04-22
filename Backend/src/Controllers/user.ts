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
                userName:{$regex:searchstring,$options:'i'}
            });
            return res.status(200).json({
                success:true,
                message:"searched user fetched successfully",
                users,
            })
}

export async function getuserprofile(req:Request,res:Response){
    const userid=req.user?._id;
    const user= await User.findById(userid);
    const formatteduser={
        _id:user?._id,
        userName:user?.userName,
        name:user?.name,
        email:user?.email,
    }
    res.status(200).json({
        user:formatteduser,
        message:'profile fetched successfully',
    })

}