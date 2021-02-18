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

function toHTML( text = 'Sample Text', src = '',  title = 'New Page') {
    let img = '';
    console.log(src);
    if(src !== '') img = `<img src='${src}'>`;

    return `<!DOCTYPE html><html><head><title>${title}</title><meta name='created' content='' /></head><body>${img}${text}</body></html>`
}

const getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};

module.exports = {
    toHTML,
    getData
};
