/**
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
*/
async function callMSGraph(endpoint, token) {
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

function callMSGraphPost(payload, endpoint, token) {
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
