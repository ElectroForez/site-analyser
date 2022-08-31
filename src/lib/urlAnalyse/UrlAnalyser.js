const {getTextFromNode} = require('../dom');
const {getWords} = require('../words');
const stat = require('../stat');
const { JSDOM } = require("jsdom");
const DataTransformer = require("./DataTransformer");
const fetch = require('node-fetch');

class UrlAnalyser {
    constructor(analyseConfig) {
        this.analyseConfig = {
            ignoreRegister: false,
            minWordLen: 1,
            wordsCount: 1,
            ...analyseConfig,
        };

        this.dataTransformer = new DataTransformer(this.analyseConfig);
    }

    async analyseUrls(urls) {
        const results = {};
        const errors = {};

        for (const url of urls) {
            const response = await fetch(url)
                .catch(error => {
                    switch (error.name) {
                        case 'TypeError':
                            errors[url] = "Некорректная ссылка";
                            break;
                        case 'FetchError':
                            errors[url] = "Недоступен";
                            break;
                        default:
                            errors[url] = error.toString();
                    }
                    console.error(error.toString())
                });

            if (!response) continue;

            if (!response.ok) {
                errors[url] = response.statusText;
                console.error(`${url} - ${errors[url]}`);
                continue
            }

            const urlContent = await response.text() || "";
            if (this.analyseConfig.ignoreRegister) {
                results[url] = await this.analyseUrlContent(urlContent.toLowerCase());
            } else {
                results[url] = await this.analyseUrlContent(urlContent);
            }
        }
        return { results, errors };
    }

    async analyseUrlContent(urlContent) {
        const { document } = new JSDOM(urlContent).window;
        const text = getTextFromNode(document.body);
        const words = getWords(text);
        const filteredWords = words.filter(word => word.length >= this.analyseConfig.minWordLen);
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
        return sortedWords.reverse().slice(0, this.analyseConfig.wordsCount);
    }
}

module.exports = UrlAnalyser;
