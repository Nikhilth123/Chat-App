import {IUser,User} from '../Models/user'
import {errorHandler,CustomError} from '../Middlewares/errormiddlewares'
import {Request,Response,NextFunction} from 'express'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface loginbody{
    loginmethod:"email" | "username";
    email?:string;
    username?:string;
    password:string;
}
interface registerbody{
    name:string;
    username:string;
    email:string;
    password:string;
}
export const login =async (req:Request,res:Response):Promise<void>=>{
    const user:loginbody= req.body;
    const {loginmethod,...rest}=user;
    if(loginmethod==="email"){
        if(!rest.email){
            throw new CustomError("Email is required for login",400);
        }   
}
    else if(loginmethod==="username"){
        if(!rest.username){
            throw new CustomError("Username is required for login",400);
        }
    }
    else{
        throw new CustomError("Invalid login method",400);
    }

    if(!rest.password){
        throw new CustomError("Password is required for login",400);
    }

    const userData= await User.findOne({[loginmethod]:rest[loginmethod]});
    if(!userData){
        throw new CustomError("User not found",404);
    }
    const password:string=userData.password;
    const ismatch =await bcrypt.compare(rest.password,password);
    if(!ismatch){
        throw new CustomError("Invalid password",401);
    }
    const token:string=jwt.sign({username:userData.username},process.env.JWT_SECRET_KEY as string,{expiresIn:"24h"});
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:24*60*60*1000,
    });
    userData.online=true;
    await userData.save();
    res.status(200).json({
        success:true,
        message:"Login successful",
    });
}


export const register =async (req:Request,res:Response):Promise<void>=>{
    const user:registerbody=req.body;
    if(!user.name || !user.username || !user.email || !user.password){
        throw new CustomError("All fields are required",400);
    }
    const existingUser= await User.findOne({$or:[{email:user.email},{username:user.username}]});
    if(existingUser){
        throw new CustomError("User with this email or username already exists",400);
    }
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(user.password,salt);
    user.password=hashedPassword;
    const newUser= await User.create(user);
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:newUser,
    }); 

}

export const logout =async (req:Request,res:Response):Promise<void>=>{
    res.clearCookie("token",{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
    });
    res.status(200).json({
        success:true,
        message:"Logout successful",
    });
   
}