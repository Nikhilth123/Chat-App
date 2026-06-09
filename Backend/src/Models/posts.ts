import mongoose,{Schema,Document, Types} from "mongoose";

export interface IPost extends Document{
    userId:Types.ObjectId;
    content:string;
    likescount:number;
    mediaUrl:string[];
    createdAt:Date;
    updatedAt:Date;
};
export interface ILikes extends Document{
    userId:Types.ObjectId;
    postId:Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}
export interface IComment extends Document{
    userId:Types.ObjectId;
    postId:Types.ObjectId;
    content:string;
    createdAt:Date;
    updatedAt:Date;
}
const postSchema= new Schema<IPost>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true,
    },
    content:{
        type:String,
        trim:true,
    },
    mediaUrl:[{
        type:String,
    }],
    likescount:{
        type:Number,
        default:0,
    }
},{timestamps:true})
const likesSchema= new Schema<ILikes>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true, 
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true,
        index:true,
    }
    
},{timestamps:true});

likesSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const CommentSchema=new Schema<IComment>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true,
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true,
        index:true,
    },
    content:{
        type:String,
        trim:true,
    }
},{timestamps:true});


export const Post=mongoose.model<IPost>("Post",postSchema);
export const Likes=mongoose.model<ILikes>("Likes",likesSchema);
export const Comment=mongoose.model<IComment>("Comment",CommentSchema);