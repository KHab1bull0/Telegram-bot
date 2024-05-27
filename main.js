
import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import fs from 'node:fs';
import { findAll, findByChatId, register } from "./services/user.js";
import { connectMongodb } from "./config/db.js";


dotenv.config()


// const token = process.env.TOKEN;
const token = '7068981084:AAH0GZcT6-E70Q5GOX-2iZHV9bPzy3Q_iwQ'
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
        command: "/foydalanuvchilar",
        description: "Userlarni ko'rish"
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
}

const contactbtn = {
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
                    text: 'Locatsiyani yuborish',
                    request_location: true
                },
            ],
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



connectMongodb()

const start = async () => {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        const first_name = msg.chat.first_name;
        const username = msg.chat.username;
        const userType = msg.chat.type;

        const contact = msg.contact;
        const location = msg.location;

        const abduvohid = 5352461835

        const user = await findByChatId(chatId);
        if (!user) {
            const data = await register(chatId, first_name, username, userType);
        };

        if (text === '/koruser') {
            const AllUser = await findAll();
            console.log(AllUser);

            for (let i = 0; i < AllUser.length; i++) {
                bot.sendMessage(chatId,
                    `${i + 1}. ChatId: ${AllUser[i].chatId}
Firstname: ${AllUser[i].first_name}
Username: ${AllUser[i].username}`);
            };
            return 0
        };


        if (text && text.split(' ')[0] === 'a') {
            bot.sendMessage(chatId, text);
            return bot.sendMessage(chatId, text);
        }

        if (text) {
            bot.sendMessage(chatId, text, btns);
        };

    });

    bot.on('contact', (msg) => {
        const chatId = msg.chat.id;
        const contact = msg.contact;

        console.log(contact);
        bot.sendMessage(chatId, contact.phone_number)
    })


    bot.on('location', (msg) => {
        const chatId = msg.chat.id;
        const location = msg.location;

        // Joylashuv ma'lumotlarini qayta ishlash
        bot.sendMessage(chatId, `Sizning joylashuvingiz:\nKenglik: ${location.latitude}\nUzunlik: ${location.longitude}`);
    });


    bot.on('callback_query', async (msg) => {
        const chatId = msg.from.id

        const AllUser = await findAll();
        for (let i = 0; i < AllUser.length; i++) {
            bot.sendMessage(chatId,
                `${i + 1}. ChatId: ${AllUser[i].chatId}\n
            firstname: ${AllUser[i].first_name}\n
            Username: ${AllUser[i].username}`);
        };
    });
};


start();

