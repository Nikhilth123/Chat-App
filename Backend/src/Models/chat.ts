import mongoose, { Document, Schema, Types } from "mongoose";


export interface IChartParticipants{
    userId: Types.ObjectId;
    status: 'accepted' | 'pending' | 'blocked';
}
export interface IMessageStatus{
  userId:Types.ObjectId;
  status:'sent'|'delivered'|'seen';
}

export interface IChat extends Document {
  isGroupChat: boolean;
  participants: IChartParticipants[];
  groupName?: string;
  groupAdmin?: Types.ObjectId;
  lastMessage?:Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        userId: {
        type: String,
        ref: "User",
        required: true,
        index:true,
        },
      
        status: {
          type: String,
          enum: ["accepted", "pending", "blocked"], 
          default:"pending",
      }
    }
    ],
    groupName: {
      type: String,
      trim: true,
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
     lastMessage: {
      type: Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  status:IMessageStatus[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status:[
     {
      userId:{
        type:Types.ObjectId,
        ref:"User",
        required:true,
      },
      status:{
        type:String,
        enum:["sent","delivered","seen"],
        default:"sent",
      },
     }
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
export const Chat = mongoose.model<IChat>("Chat", chatSchema);