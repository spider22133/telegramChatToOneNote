async function sendNote(data) {
    const {title, section, text, content} = data;
    const {value} = await getNotes();
    let page_id;

    value.forEach(page => {
        if (page.title === title) {
            page_id = page.id;
        }
    });

    if (page_id) {
        updateNote(content, page_id);
    } else {
        getTokenPopup(tokenRequest)
            .then(response => {
                addNewPage(text, `${graphConfig.graphNotesPagesEndpoint}?sectionName=${section}`, response.accessToken);
            }).catch(error => {
            console.error(error);
        });
    }
}

async function getNotes() {
    try {
        const token = await getTokenPopup(tokenRequest);
        return await getPageData(graphConfig.graphNotesPagesEndpoint, token.accessToken);
    } catch (e) {
        console.log(e)
    }
}

function updateNote(text, page_id) {
    getTokenPopup(tokenRequest)
        .then(response => {
            updatePage(text, `${graphConfig.graphNotesPagesEndpoint}/${page_id}/content`, response.accessToken);
        }).catch(error => {
        console.error("updateNote", error);
    });
}
