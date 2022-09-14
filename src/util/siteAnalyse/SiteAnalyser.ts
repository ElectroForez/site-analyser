import * as stat from '../stat';
import { JSDOM } from 'jsdom';
import {getTextFromNode} from "../dom";
import {getWords} from "../words";
import fetch from "node-fetch";
import {ErrorResult, Results, SuccessResult} from "./interfaces";

export interface AnalyseConfig {
    ignoreRegister: boolean;
    minWordLen: number;
    wordsCount: number
}


export default class SiteAnalyser {
    constructor(private analyseConfig: AnalyseConfig) {
    }

    async analyseFromUrls(urls: Array<string>): Promise<Results> {
        const results: Results = {
            success: {},
            errors: {}
        };

        await Promise.allSettled(urls.map(async (url) => {
            const result: SuccessResult | ErrorResult | any = {};

            const response = await fetch(url)
                .catch(error => {
                    switch (error.name) {
                        case 'TypeError':
                            result.reason = "Некорректная ссылка";
                            break;
                        case 'FetchError':
                            result.reason = "Недоступен";
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

    async analyseHTMLContent(HTMLContent: string) {
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
