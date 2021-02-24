const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const path = require('path');
const {toHTML, getData} = require("./telegram");

// Kommenturensohn

const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '1671081058:AAGiE4gpnBoZn4Hg8uJLqRmdMeIDhCDqpmo';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


// EXPRESS APP
const DEFAULT_PORT = process.env.PORT || 3000;

// initialize express.
// const app = express();
// const io = require('socket.io')(app);
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
    // console.log('a user connected');
    // TELEGRAM
    bot.on("polling_error", console.log);
    bot.on('message', (msg) => {
        // ID
        const chatId = msg.chat.id;

        (async () => {
            let payload = '';

            // images and files handler
            const dataFile = await getData(msg.caption, chatId, msg, bot).then(data => data);

            // text handler
            const dataText = await getData(msg.text, chatId, msg, bot).then(data => data);

            if(dataFile) payload = toHTML(dataFile[1], dataFile[0], "Page with image and text");
            if(dataText) payload = toHTML(dataText, '', "Page with text");

            socket.emit('for_client_send', payload);
            socket.on('for_server_send', function(data) {
                if(data) bot.sendMessage(chatId, 'Saved in OneNote');
            });
        })();

    });

});

// Start the server.
http.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


