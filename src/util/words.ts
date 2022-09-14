export function getWords(str: string, minWordLen=1) {
    /* returns array with consecutive letters from string */
    if (minWordLen < 0) {
        throw new Error(`Invalid minimal word length: ${minWordLen}`);
    }

    const wordRe = new RegExp(`[A-ZА-Я]{${minWordLen},}`, 'i');
    return str.split(/\s+/)
        .filter(value => value.match(wordRe))
        .map(value => (value.match(wordRe) || [value])[0]);
}
