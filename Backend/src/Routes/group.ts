import express, { Router } from "express";
import { asyncHandler } from "../asyncHandler";
import { authMiddleware } from "../Middlewares/authmiddlewares";
import { addGroupParticipants, createGroup, getuserAllGroups, leaveGroup, makeadmin, removeAdmin } from "../Controllers/group";
const router=express.Router();
console.log('req got for group');
router.post('/creategroup',(req,res,next)=>{
    console.log('req got');
    next();
},authMiddleware,asyncHandler(createGroup))
router.get('/grouplist',authMiddleware,asyncHandler(getuserAllGroups))
router.post('/:groupId/addparticipants',authMiddleware,asyncHandler(addGroupParticipants));
router.post('/groupchat/:groupId/remove',authMiddleware,asyncHandler(leaveGroup));
router.post('/groupchat/:groupId/makeadmin',authMiddleware,asyncHandler(makeadmin));
router.post('/groupchat/:groupId/removeadmin',authMiddleware,asyncHandler(removeAdmin))
export default router;