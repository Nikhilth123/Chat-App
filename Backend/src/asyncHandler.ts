import { Request, Response, NextFunction } from "express";

type asyncFunction= (req:Request,res:Response,next:NextFunction)=>Promise<any>;


export const asyncHandler = (fn:asyncFunction) => (req:Request,res:Response,next:NextFunction):void => {
    Promise.resolve(fn(req,res,next)).catch(next);
}