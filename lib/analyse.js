const {getTextFromNode} = require('./dom');
const {getWords} = require('./words');
const stat = require('./stat');
const { JSDOM } = require("jsdom");

const MIN_WORDS_LEN = 4;
const WORDS_COUNT = 3;

async function analyse(urlContent) {
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

function analyseResultToArray(analyseResult) {
    const header = Array.from({ length: WORDS_COUNT + 1}, (v, k) => k);
    header[0] = "";
    const array = [header];
    for (const [url, words] of Object.entries(analyseResult)) {
        const row = [url, ...words];
        array.push(row);
    }
    return array;
}

module.exports = {
    analyse,
    analyseResultToArray
}