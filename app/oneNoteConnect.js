async function getNotes() {
    try {
        const token = await getTokenPopup(tokenRequest);
        return await callMSGraph(graphConfig.graphNotesPagesEndpoint, token.accessToken);
    }
    catch (e) {
        console.log(e)
    }

}

async function sendNote(data, section = "New%20Section") {
    const {value} = await getNotes();

    value.forEach(page => {
        console.log(page)
    });
    console.log(data);
    /*getTokenPopup(tokenRequest)
        .then(response => {
            callMSGraphPost(data, `${graphConfig.graphNotesPagesEndpoint}?sectionName=${section}`, response.accessToken);
        }).catch(error => {
        console.error(error);
    });*/
}

function updateNote() {

}
