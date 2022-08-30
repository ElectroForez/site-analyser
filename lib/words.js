function getWords(str, minWordLen=1) {
    /* returns array with 2 or more consecutive letters from string */
    const wordRe = new RegExp(`[A-ZА-Я]{${minWordLen},}`, 'i');
    return str.split(/\s+/)
        .filter(value => value.match(wordRe))
        .map(value => value.match(wordRe)[0])
}

module.exports = {
    getWords
}