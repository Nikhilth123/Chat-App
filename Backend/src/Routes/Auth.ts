import express,{Application,Request,Response,NextFunction} from 'express'
import { login, register, logout } from '../Controllers/Auth';
const router = express.Router();

type asyncFunction= (req:Request,res:Response,next:NextFunction)=>Promise<any>;


const asyncHandler = (fn:asyncFunction) => (req:Request,res:Response,next:NextFunction):void => {
    Promise.resolve(fn(req,res,next)).catch(next);
}

router.post('/login',asyncHandler(login));

router.post('/register',asyncHandler(register));

router.post('/logout',asyncHandler(logout));

export default router;