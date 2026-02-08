import express,{Application,Request,Response,NextFunction} from 'express'

const router = express.Router();

const asyncHandler = (fn:Function) => (req:Request,res:Response,next:NextFunction) => {
    Promise.resolve(fn(req,res,next)).catch(next);
}

router.post('/login',asyncHandler());

router.post('/register',asyncHandler());

router.post('/logout',asyncHandler());

export default router;