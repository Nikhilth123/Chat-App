import jwt from 'jsonwebtoken';
import {Request,Response,NextFunction} from 'express';
import{User} from '../Models/user';
import {CustomError} from './errormiddlewares';

import { IUser } from "../Models/user";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}


export const authMiddleware=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const token=req.cookies.token;
    if(!token){
        throw new CustomError("Unauthorized: No token provided",401);
    }
    const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
    if(!JWT_SECRET_KEY){
        throw new CustomError("JWT secret key is not defined",500);
    }
    const decoded=jwt.verify(token,JWT_SECRET_KEY);
    if (
  typeof decoded !== "object" ||
  decoded === null ||
  !("username" in decoded)
) {
  throw new CustomError("Invalid token payload", 401);
}

const { username } = decoded as { username: string };
    const user=await User.findOne({username});
    if(!user){
        throw new CustomError("Unauthorized: User not found",401);
    }
    req.user=user;
    next();
}