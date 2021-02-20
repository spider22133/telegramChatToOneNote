// const showdown = require('showdown'),
//     converter = new showdown.Converter();

async function getData(data, chatId, msg, bot) {

    if (!data) return null;

    if (data.search('\/bookmark') !== -1) {
        if (msg.document) {
            return await getFileData(msg, data, bot);
        } else {
            return data.replace('\/bookmark', '');
        }

    }
}

async function getFileData(msg, data, bot) {
    let img = [];

    img[0] = await bot.getFileLink(msg.document.file_id);
    if (data.replace('\/bookmark', '').length > 0) img[1] = await data.replace('\/bookmark', '');

    return img;
}

function toHTML(text = 'Sample Text', src = '', title = 'New Page') {
    let img = '';
    console.log('text1\n', text);

    text = escape(text);
    console.log('text2\n', text);

    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
    console.log('text3\n', text);

    // let html = converter.makeHtml(text);
    // console.log('html1\n', html);
    if (src !== '') img = `<img src='${src}'>`;

    return `<!DOCTYPE html><html><head><title>${title}</title><meta name='created' content='' /></head><body>${img}${text}</body></html>`
}

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

var escape = function (str) {
    return str.replace(/[\u2018\u2019\u00b4]/g, "'")
        .replace(/[\u201c\u201d\u2033]/g, '"')
        .replace(/[\u2212\u2022\u00b7\u25aa]/g, '-')
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
        .replace(/^\s+|[\s\\]+$/g, '');
};

module.exports = {
    toHTML,
    getData
};
