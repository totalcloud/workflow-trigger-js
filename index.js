const fetch = require("isomorphic-fetch");
const getToken = require('./token');

(async function trigger() {
    const trigger_url = process.argv[4];
    if (!trigger_url) {
        console.error('missing trigger_url');
        return;
    }
    const token = await getToken();
    const {response} = await fetch(trigger_url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({}),
    }).then(r => r.json());
    console.log("response:", response);
})().catch(console.error);
