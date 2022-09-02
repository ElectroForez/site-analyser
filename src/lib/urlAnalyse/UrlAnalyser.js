const {getTextFromNode} = require('../dom');
const {getWords} = require('../words');
const stat = require('../stat');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

class UrlAnalyser {
    constructor(analyseConfig) {
        this.analyseConfig = {
            ignoreRegister: false,
            minWordLen: 1,
            wordsCount: 1,
            ...analyseConfig,
        };
    }

    async analyseUrls(urls) {
        const results = {
            success: {},
            errors: {}
        };

        await Promise.allSettled(urls.map(async (url) => {
            const result = {};

            const response = await fetch(url)
                .catch(error => {
                    switch (error.name) {
                        case 'TypeError':
                            result.reason = "Некорректная ссылка";
                            break;
                        case 'FetchError':
                            result.reason = "Недоступен";
                            console.log("AAAA")
                            break;
                        default:
                            result.reason = error.name;
                    }
                    console.error(error.toString())
                });

            if (!response) {
                result.redirect = null;
                results.errors[url] = result;
                return;
            }

            result.redirect = url === response.url ?
                null : response.url;

            if (!response.ok) {
                result.reason = response.statusText;
                console.error(`${url} - ${result.reason}`);
                results.errors[url] = result;
                return;
            }

            const urlContent = await response.text() || "";
            if (this.analyseConfig.ignoreRegister) {
                result.value = await this.analyseHTMLContent(urlContent.toLowerCase());
            } else {
                result.value = await this.analyseHTMLContent(urlContent);
            }

            results.success[url] = result;
        }));

        return results;
    }

    async analyseHTMLContent(HTMLContent) {
        const { document } = new JSDOM(HTMLContent).window;
        const text = getTextFromNode(document.body);
        const words = getWords(text, this.analyseConfig.minWordLen);
        const wordsStat = stat.getCounts(words);
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
        const result = sortedWords.reverse().slice(0, this.analyseConfig.wordsCount);
        result.length = this.analyseConfig.wordsCount;
        return result;
    }
}

module.exports = UrlAnalyser;
