import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()



// const url = process.env.MONGODB;
// console.log(url)

export const connectMongodb = async () => {

    await mongoose.connect("mongodb://localhost:27017/userinfo")
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
};