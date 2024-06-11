import { User } from "../models/user.schema.js"

export const register = async (chatId, first_name, username, chat_Type, phone_number) => {
    const data = await User({
        chatId,
        first_name,
        username,
        phone_number,
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

