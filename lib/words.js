function getWords(str) {
    /* returns array with 2 or more consecutive letters from string */
    const wordRe = /[A-ZА-Я]{2,}/i;
    return str.split(/\s+/)
        .filter(value => value.match(wordRe))
        .map(value => value.match(wordRe)[0])
}

module.exports = {
    getWords
}