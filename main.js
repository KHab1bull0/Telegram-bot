
import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import fs from 'node:fs';
import { findAll, findByChatId, register } from "./services/user.js";
import { connectMongodb } from "./config/db.js";
import { match } from "node:assert";
import ffmpeg from 'fluent-ffmpeg';

// // Video faylning yo'li
const videoPath = './photo/auto.mp4';

// Video haqida ma'lumot olish
// ffmpeg.ffprobe(videoPath, (err, metadata) => {
//     if (err) {
//         console.error('Xatolik:', err);
//         return;
//     }

//     console.log('Video haqida ma\'lumot:');
//     console.log('Format:', metadata.format.format_name);
//     console.log('Davomiyligi:', metadata.format.duration, 'soniya');
//     console.log('Kengligi:', metadata.streams[0].width);
//     console.log('Balandligi:', metadata.streams[0].height);
// });



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
                },
                {
                    text: "Video"
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

bot.on('polling_error', (error) => {
    console.log('Polling error:', error.code, error.message);
    // Retry logic
    setTimeout(() => {
        bot.startPolling();
    }, 5000); // 5 seconds delay
});

const start = async () => {

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const username = msg.chat.username;
        const text = msg.text;

        if (text === '/start') {
            return bot.sendMessage(chatId, `Assalomu alaykum ${username}  👋
Botimizga xush kelibsiz 🎉
Kontaktingizni  📱  yuboring!  (Yuborish uchun tugmani bosing ⬇️)`, contactbtn);
        }

    });



    //     bot.onText('users', async (msg) => {
    //         const chatId = msg.from.id

    //         const AllUser = await findAll();
    //         for (let i = 0; i < AllUser.length; i++) {
    //             bot.sendMessage(chatId,
    //                 `${i + 1}. ChatId: ${AllUser[i].chatId}\n
    // firstname: ${AllUser[i].first_name}\n
    // Username: ${AllUser[i].username}`);
    //         };
    //     });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const chatIdshavkat = 2010155328
        const chatIdabduvohid = 5352461835
        const chatIdbexruz = 1302939620
        const chatIdOybek = 5430738786
        const chatIdBot = 6824503053

        const text = msg.text;
        const username = msg.chat.username;
        const first_name = msg.chat.first_name;
        const last_name = msg.chat.last_name
        const location = msg.location;
        console.log(msg);
        // const count = await bot.
        // console.log(count)



        if (text === '/userlar_soni') {
            const AllUser = await findAll();
            return bot.sendMessage(chatId, AllUser.length);
        };

        const lastmessage = await bot.getUpdates({offset: 2});
        console.log(lastmessage)
        if (text == 'Test') {
            bot.sendMessage(chatId, lastmessage[0]?.message?.text);
        }


        if (text == 'Video') {

            const groupId = -1002003362246
            const groupId2 = -1001178845565
            const messageId = 42
            bot.forwardMessage(chatId, groupId, messageId);




            //             // HTML formatida xabar yuborish
            //             const htmlMessage = `
            //         <b>Assalomu alaykum!</b>
            // <i>Bu HTML formatida yozilgan xabar.</i>
            // <a href="https://www.example.com">Havola</a>
            //     `;

            //             bot.sendMessage(chatId, htmlMessage, { parse_mode: 'HTML' });
            //             const videoUrl = './photo/jam.mp4';
            //             const caption = `<b> BlackCars </b>
            // <a href="https://www.instagram.com/blackcarsuz/"> BlackCars.uz </a>`;

            //             const options = {
            //                 caption: caption,
            //                 parse_mode: "HTML",
            //                 width: 1080,
            //                 height: 1920
            //             };

            //             // bot.sendVideo(chatId, videoUrl, options)
            //             //     .then(() => {
            //             //         console.log('Video yuborildi');
            //             //     })
            //             //     .catch((error) => {
            //             //         console.error('Video yuborishda xatolik:', error);
            //             //     })
        }

        // bot.sendMessage(chatId, text || '.')

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


        bot.sendMessage(chatId, 'Botga xush kelibsiz', btns);
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

