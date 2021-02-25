async function getNotes() {
    try {
        const token = await getTokenPopup(tokenRequest);
        return await callMSGraph(graphConfig.graphNotesPagesEndpoint, token.accessToken);
    }
    catch (e) {
        console.log(e)
    }

}

async function sendNote(data) {
    const {section, text} = data;
    const {value} = await getNotes();

    value.forEach(page => {
        console.log(page)
    });

    console.log(data);
    // getTokenPopup(tokenRequest)
    //     .then(response => {
    //         callMSGraphPost(text, `${graphConfig.graphNotesPagesEndpoint}?sectionName=${section}`, response.accessToken);
    //     }).catch(error => {
    //     console.error(error);
    // });
}

function updateNote() {

}
