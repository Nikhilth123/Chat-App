import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, "./.env"),
});
const connectDB = async () => {
  try {
     console.log("Connecting to MongoDB...",process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI! as string);    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
export default connectDB;