
import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import fs from 'node:fs';
import { findAll, findByChatId, register } from "./services/user.js";
import { connectMongodb } from "./config/db.js";


dotenv.config()


const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });



bot.setMyCommands([
    {
        command: "/start",
        description: "Qayta ishga tushirish"
    },
    {
        command: "/info",
        description: "Bot haqida malumot olish"
    }, {
        command: "/userlar_soni",
        description: "User sonini ko'rish"
    }
]);



const button = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: "Vazifalar", callback_data: "vazifalar"
                },
                {
                    text: "Eslatma ", callback_data: "eslatma"
                },
                {
                    text: "Vazifa qo'shish", callback_data: "qo'shish"
                }
            ],
        ]
    }
};

const contactbtns = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Contactni yuborish',
                    request_contact: true
                },
            ],
        ],
        one_time_keyboard: true
    }
};


const btns = {
    reply_markup: {
        keyboard: [
            
            [
                {
                    text: "Test"
                }
            ],
        ],
        resize_keyboard: true
    }
};

export const contactbtn = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: "contact",
                    request_contact: true
                },
            ]
        ],
        one_time_keyboard: true
    }
}



connectMongodb()

const start = async () => {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id
        const text = msg.text;
        const first_name = msg.chat.first_name;
        const username = msg.chat.username;
        const userType = msg.chat.type;
        const last_name = msg.chat.last_name
        const contact = msg.contact;
        const location = msg.location;
       
        
        const user = await findByChatId(chatId);
        if (!user) {
            const data = await register(chatId, first_name, username, userType);
        };

        if (text === '/userlar_soni') {
            const AllUser = await findAll();
            return bot.sendMessage(chatId, AllUser.length);
        };

        if (text === '/start') {
            return bot.sendMessage(chatId, `Assalomu alaykum ${username}  👋
Botimizga xush kelibsiz 🎉
Kontaktingizni  📱  yuboring! (Yuborish uchun tugma ⬇️)`, contactbtn);
          }
        if (text) {
            bot.sendMessage(chatId, text, btns);
            bot.deleteMessage(chatId, messageId);
        };


    });

    bot.on('contact', (msg) => {
        const chatId = msg.chat.id;
        const contact = msg.contact;
        bot.sendMessage(chatId, `Your phone ${contact.phone_number} hacked `)
    })


    bot.on('location', (msg) => {
        const chatId = msg.chat.id;
        const location = msg.location;

        // Joylashuv ma'lumotlarini qayta ishlash
        bot.sendMessage(chatId, `Sizning joylashuvingiz:\nKenglik: ${location.latitude}\nUzunlik: ${location.longitude}`);
    });


    // bot.on('callback_query', async (msg) => {
    //     const chatId = msg.from.id

    //     const AllUser = await findAll();
    //     for (let i = 0; i < AllUser.length; i++) {
    //         bot.sendMessage(chatId,
    //             `${i + 1}. ChatId: ${AllUser[i].chatId}\n
    //         firstname: ${AllUser[i].first_name}\n
    //         Username: ${AllUser[i].username}`);
    //     };
    // });
};


start();

