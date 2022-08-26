const Boom = require("@hapi/boom");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");


function getTextFromNode(node) {
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;

    if (node.nodeType === TEXT_NODE) {
        return node.nodeValue + "\n";
    }
    else if (node.nodeType === ELEMENT_NODE) {
        if (!["SCRIPT", "STYLE"].includes(node.tagName)) {
            return Array.from(node.childNodes).reduce((prev, cur) => {
                return prev + getTextFromNode(cur);
            }, "")
        }
    }
    return "";
}

async function response(request, h) {
    const urls = request.payload.urls;
    if (!urls) {
        throw Boom.badRequest('Urls for analyse in body not found');
    }

    for (const url of urls) {
        const response = await fetch(url)
            .catch(error => console.log(error.toString()));
        if (!response) {
            continue;
        }
        if (!response.ok) {
            console.log("bad status code from " + url);
            continue
        }

        const urlContent = await response.text();
        const { document } = new JSDOM(urlContent).window;
        console.log(getTextFromNode(document.body));
    }
    return {message: request.payload.urls}
}

module.exports = {
    method: 'POST',
    path: '/analyse',
    handler: response
}