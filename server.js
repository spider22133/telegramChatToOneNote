const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const path = require('path');
const {toHTML, getData} = require("./telegram");

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

    // TELEGRAM
    bot.on("polling_error", console.log);
    bot.on('message', (msg) => {
        // console.log(msg);
        // ID
        let chatId = msg.chat.id;

        (async () => {
            let payload = '';

            // images and files handler
            const dataFile = await getData(msg.caption, msg, bot).then(data => data);

            // text handler
            const dataText = await getData(msg.text, msg, bot).then(data => data);

            if(dataFile) payload = toHTML(dataFile[1], dataFile[0], "Page with image and text");
            if(dataText) payload = toHTML(dataText, '', "Page with text");
            // console.log(payload);
            (payload) ? socket.emit('for_client_send', payload) : socket.emit('for_client_send', false);

            socket.on('for_server_send', function(data) {
                // TODO make a 'Saved in OneNote' only for one tab(client).

                (data) ? bot.sendMessage(chatId, 'Saved in OneNote') : bot.sendMessage(chatId, 'Nothing to save');
                socket.removeAllListeners();
            });
        })();

    });

});

// Start the server.
http.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


