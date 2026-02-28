import express,{Request,Response,NextFunction} from 'express'
import { login, register, logout } from '../Controllers/Auth';
import { asyncHandler } from '../asyncHandler';
const router = express.Router();

// type asyncFunction= (req:Request,res:Response,next:NextFunction)=>Promise<any>;


// const asyncHandler = (fn:asyncFunction) => (req:Request,res:Response,next:NextFunction):void => {
//     Promise.resolve(fn(req,res,next)).catch(next);
// }
console.log("auth route is being called");  

router.post('/login',asyncHandler(login));

router.post('/register',asyncHandler(register));

router.post('/logout',asyncHandler(logout));

export default router;