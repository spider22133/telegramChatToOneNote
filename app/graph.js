/**
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
*/
async function getPageData(endpoint, token) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('GET request made to Graph API at: ' + new Date().toString());
    const res = await fetch(endpoint, options);
    return await res.json();
}

function addNewPage(payload, endpoint, token) {
    const options = {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : "application/xhtml+xml",
            'Content-Length': payload.length
        },
        body: JSON.stringify(payload)
    };

    console.log('POST request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(error => console.log(error));
}

function updatePage(payload, endpoint, token) {
    const newContent = [{
        'target':'body',
        'action':'append',
        'content': payload
    }];

    const options = {
        method: "PATCH",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json',
            'Content-Length': newContent.length
        },
        body: JSON.stringify(newContent)
    };

    console.log('POST request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.text())
        .then(response => response)
        .catch(error => console.log("callMSGraphPostUpdate",error));
}
