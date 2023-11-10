require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const token = process.env.BOT_TOKEN;
const app = express();
const port = process.env.PORT || 3000;
const bot = new TelegramBot(token);

bot.setWebHook(process.env.APP_URL + bot.token);

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Wiz! Wiz! That's the way" });
});

app.post(`/${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Express server is listening on ${port}`);
});

bot.on('pinned_message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'A message was pinned!');
});
