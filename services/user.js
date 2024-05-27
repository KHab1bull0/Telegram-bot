import { User } from "../models/user.schema.js"

export const register = async (chatId, first_name, username, chat_Type) => {
    const data = await User({
        chatId,
        first_name,
        username,
        chat_Type
    });
    await data.save();
    return data;
};

export const findByChatId = async (chatId) => {
    const data = await User.find({chatId});
    return data[0];
};

export const findAll = async () => {
    const data = await User.find();
    return data;
};