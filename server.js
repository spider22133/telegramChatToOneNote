const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const path = require('path');
const {sendToOneNote} = require("./telegramToOneNote");

const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '1671081058:AAGiE4gpnBoZn4Hg8uJLqRmdMeIDhCDqpmo';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


// EXPRESS APP
const DEFAULT_PORT = process.env.PORT || 3000;

// Initialize variables.
let port = DEFAULT_PORT;

// Configure morgan module to log all requests.
app.use(morgan('dev'));

// Setup app folders.
app.use(express.static('app'));

// Set up a route for index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', (socket) => {
    // TELEGRAM
    bot.on("polling_error", console.log);
    bot.on('message', (msg) => {
        const {text, caption} = msg;

        if (text) {
            if (text.search('\/bookmark') === -1) return; // Stop if no pointer in text
            sendToOneNote(text, msg, bot, socket);
        }

        if (caption) {
            if (caption.search('\/bookmark') === -1) return;  // Stop if no pointer in caption
            sendToOneNote(caption, msg, bot, socket);
        }
    });
});

// Start the server.
http.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


