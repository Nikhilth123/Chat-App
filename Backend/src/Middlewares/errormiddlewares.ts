import { Request,Response,NextFunction } from "express";

export const errorHandler = (err:any,req:Request,res:Response,next:NextFunction):void => {
    let statuscode=err.statuscode || 500;
    let message=err.message || "Internal Server Error";
    if(!err.isoperational){
        console.log('not an operational err:',err);
         res.status(500).json({
            success:false,
            message:"something went wrong",
        });
        return;
    }
    else{

    res.status(statuscode).json({
        success:false,
        message,
        ...(process.env.NODE_ENV === "development" && {stack:err.stack})
    });
    return;
}
}

class CustomError extends Error{
    statuscode:number;
   isoperational:boolean;
   
   constructor(message:string,statuscode:number){
    super(message);
    this.statuscode=statuscode;
    this.isoperational=true;
    Error.captureStackTrace(this,this.constructor);
   }
    
}