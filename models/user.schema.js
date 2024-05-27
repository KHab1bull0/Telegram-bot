import { Schema, model } from "mongoose";


const userSchema = new Schema({
    chatId: {
        type: String
    },
    first_name: {
        type: String,
    },
    username: {
        type: String,
        unique :true,
    },
    chat_type: {
        type: String
    },
    joined_At: {
        type: Date,
        default: Date.now
    }
});

export const User = model('userInfo', userSchema);