require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const cors = require('cors');

const token = process.env.BOT_TOKEN;
const app = express();
const port = process.env.PORT || 3000;
const bot = new TelegramBot(token);
const server = require('http').Server(app);
const io = socketIo(server);

bot.setWebHook(`${process.env.APP_URL}/${token}`);

app.use(express.static('public'));  
app.use(bodyParser.json());
app.use(cors()); 

bot.on('pinned_message', (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.pinned_message.message_id;
    const messageText = msg.pinned_message.text;
    bot.sendMessage(chatId, 'Wiz pinned a message!');
    io.emit('pinned_message', { messageId, messageText });
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.get('/', (req, res) => {
    res.status(200).send("Wiz! Wiz! That's the way");
});

app.post(`/${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

