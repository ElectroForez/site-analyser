function getWords(str) {
    /* returns array with consecutive letters from string */
    const wordRe = /[A-ZА-Я]+/i;
    return str.split(/\s+/)
        .filter(value => value.match(wordRe))
        .map(value => value.match(wordRe)[0]);
}

module.exports = {
    getWords
}