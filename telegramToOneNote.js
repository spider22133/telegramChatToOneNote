const showdown = require('showdown'),
    converter = new showdown.Converter();

async function sendToOneNote(str, msg, bot, socket) {
    const {chat: {id}} = msg;
    let payload;

    payload = await getData(str, msg, bot);
    payload = toHTML({...payload});

    (payload) ? socket.emit('for_client_send', payload) : socket.emit('for_client_send', false);

    socket.on('for_server_send', function (data) {
        // TODO make a 'Saved in OneNote' only for one tab(client).

        (data) ? bot.sendMessage(id, 'Saved in OneNote') : bot.sendMessage(id, 'Nothing to save');
        socket.removeAllListeners();
    });
}

async function getData(str, msg, bot) {
    const {document, photo} = msg;
    const titles = getPointers(str); // get Array with section and title
    console.log(titles);
    if (document) {
        return await getFileData(document, str, bot, titles);
    } else if (photo) {
        return await getFileData(photo[2], str, bot, titles);
    } else {
        return {...titles, text: escape_pointers(str)};
    }
}

async function getFileData(doc, str, bot, titles) {
    let img = {};

    if (str.replace('\/bookmark', '').length > 0) img['text'] = escape_pointers(str);
    try {
        img['src'] = await bot.getFileLink(doc.file_id);
    } catch (err) {
        console.log(err)
    }

    return {...img, ...titles};
}

function getPointers(str){
    let newObj = {};
    let title = str.match('/b_title (.*?)}}');
    let section = str.match('/b_section (.*?)}}');

    title = getFromBetween.get(title[0],"{{","}}");
    section = getFromBetween.get(section[0],"{{","}}");

    newObj['title'] = title[0];
    newObj['section'] = section[0];
 return newObj;
}

function toHTML({text, src, title, section}) {
    let img = '', html;

    if (text.trim() === '' && src === '') return false; // stop if no text and no image
    if (src !== undefined) img = `<img src='${src}'>`;

    html = converter.makeHtml(escape(text)); // escape to create markdown, then add tags to markdown
    html = html.replace(/>\s+</g, "><"); // delete all spaces between tags

    return {
        text:`<!DOCTYPE html><html><head><title>${title}</title><meta name='created' content='' /></head><body>${img}${html}</body></html>`,
        content: `${img}${html}`,
        title,
        section
    }
}

const escape = (str) => {
    return str.replace(/[\u2018\u2019\u00b4]/g, "'")
        .replace(/[\u201c\u201d\u2033]/g, '"')
        .replace(/[\u2212\u2022\u00b7\u25aa]/g, '-')
        .replace(/[\u00AD\u002D]/g, ' - ')
        .replace(/[\u2013\u2015]/g, '--')
        .replace(/\u2014/g, '---')
        .replace(/\u2026/g, '...')
        .replace(/[ ]+\n/g, '\n')
        .replace(/\s*\\\n/g, '\\\n')
        .replace(/\s*\\\n\s*\\\n/g, '\n\n')
        .replace(/\s*\\\n\n/g, '\n\n')
        .replace(/\n-\n/g, '\n')
        .replace(/\n\n\s*\\\n/g, '\n\n')
        .replace(/\n\n\n*/g, '\n\n')
        .replace(/[ ]+$/gm, '')
        .replace(/^\s+|[\s\\]+$/g, '')
        .replace(/\n/g, "\n\n");
};

const escape_pointers = (str) => {
    return str.replace('\/bookmark', '')
        .replace('\/b_title', '')
        .replace('\/b_section', '')
        .replace(/{{.*?}}/g, '');
};

const getFromBetween = {
    results: [],
    string: "",
    getFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1) + sub1.length;
        var string1 = this.string.substr(0, SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP, TP);
    },
    removeFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
        this.string = this.string.replace(removal, "");
    },
    getAllResults: function (sub1, sub2) {
        // first check to see if we do have both substrings
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1, sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1, sub2);

        // if there's more substrings
        if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1, sub2);
        } else return;
    },
    get: function (string, sub1, sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1, sub2);
        return this.results;
    }
};

module.exports = {
    sendToOneNote
};
