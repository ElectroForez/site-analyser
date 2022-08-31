
class DataTransformer{
    /* class for transform analyse data to other formats */
    constructor(config) {
        this.config = {
            wordsCount: undefined,
            ...config,
        };
    }

    resultsToArrayTable(results) {

        if (!this.config.wordsCount) {
            const maxWordsCount = Object.values(results)
                .reduce((prev, cur) => cur.length > prev.length ? cur : prev).length;

            if (!maxWordsCount) return [[]];

            this.config.wordsCount = maxWordsCount;
        }

        const header = Array.from({ length: this.config.wordsCount + 1},
            (v, k) => k + " место");
        header[0] = "URL";

        const array = [header];
        for (const [url, words] of Object.entries(results)) {
            const row = [url, ...words];
            row.length = header.length;
            array.push(row);
        }
        return array;
    }

    errsToArrayTable(errors) {
        const header = ["URL", "Error"];

        const array = [header];
        for (const [url, error] of Object.entries(errors)) {
            const row = [url, error];
            array.push(row);
        }
        if (!array.length) array.push([]);
        return array;
    }

}

module.exports = DataTransformer;
