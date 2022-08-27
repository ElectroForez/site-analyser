const Boom = require("@hapi/boom");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { getTextFromNode } = require("../lib/dom");
const { getWords } = require("../lib/words");
const stat = require("../lib/stat");
const fs = require("fs");
const path = require("path");

async function analyse(urlContent) {
    const MIN_WORDS_LEN = 4;
    const WORDS_COUNT = 3;

    const { document } = new JSDOM(urlContent).window;
    const text = getTextFromNode(document.body);
    const words = getWords(text);
    const filteredWords = words.filter(word => word.length > MIN_WORDS_LEN);
    const wordsStat = stat.getCounts(filteredWords);
    const sortedWords = Object.entries(wordsStat).sort((a, b) => {
        const countA = a[1];
        const countB = b[1];

        if (countA > countB) {
            return 1;
        }
        if (countA < countB) {
            return -1;
        }

        return 0;
    })
        .map(([word, count]) => word);
    return sortedWords.reverse().slice(0, WORDS_COUNT);
}

async function response(request, h) {
    const urls = request.payload.urls;
    const result = {};
    if (!urls) {
        throw Boom.badRequest('Urls for analyse in body not found');
    }

    for (const url of urls) {
        const response = await fetch(url)
            .catch(error => console.error(error.toString()));
        if (!response) {
            continue;
        }

        if (!response.ok) {
            console.log("bad status code from " + url);
            continue
        }

        const urlContent = await response.text();
        result[url] = await analyse(urlContent);
        fs.writeFileSync(path.join('documents', new URL(url).host + '.html'), urlContent);
    }
    return {message: result}
}

module.exports = {
    method: 'POST',
    path: '/analyse',
    handler: response
}