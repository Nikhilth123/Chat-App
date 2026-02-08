import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    name:string;
    username:string;
    email:string;
    password:string;
    online:boolean;
    createdAt:Date;
    updatedAt:Date;
}
const userSchema= new Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    online:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

export const User=mongoose.model<IUser>("User",userSchema);