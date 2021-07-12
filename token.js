const fetch = require("isomorphic-fetch");
require('dotenv').config();

module.exports = async function () {
    const {CLIENT_ID, AUTH_SERVER, REDIRECT_URI} = process.env;
    const [, , username, password] = process.argv;
    const baseString = REDIRECT_URI + "#access_token=";

    if (!username || !password) {
        console.error("Missing Username and/or password, fmt = node index.js `username` `password`")
        return;
    }

    // Make a call to the authn api to get a sessionToken
    const {status, sessionToken} = await fetch(`${AUTH_SERVER}/api/v1/authn`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    }).then(r => r.json());

    if (status !== 'SUCCESS') {
        console.error("invalid username and password")
        return;
    }

    // Send the session token as a query param in a GET request to the authorize api
    const authorizeRes = await fetch(
        `${AUTH_SERVER}/oauth2/default/v1/authorize?` +
        "response_type=token&" +
        "scope=openid&" +
        "state=HttpTrigger&" +
        "nonce=HttpTrigger&" +
        `client_id=${CLIENT_ID}&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `sessionToken=${sessionToken}`,
    );

    // Parse access_token from url
    let url = authorizeRes.url;

    if (url.indexOf(baseString) === -1) {
        console.error("invalid username and password")
        return;
    }

    return url.substring(baseString.length, url.indexOf("&"));
}

if (process.argv[1] === __dirname + "/token.js") {
    module.exports().then(process.stdout.write.bind(process.stdout)).catch(console.error)
}