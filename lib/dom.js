function getTextFromNode(node, sep="\n", ignoreTags=["SCRIPT", "STYLE"]) {
    /* returns textContext from dom element and his children */
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;

    if (node.nodeType === TEXT_NODE) {
        return node.nodeValue + sep;
    }
    else if (node.nodeType === ELEMENT_NODE) {
        const childNodes = Array.from(node.childNodes);
        if (!ignoreTags.includes(node.tagName)) {
            return childNodes.reduce((prev, cur) => prev + getTextFromNode(cur, sep, ignoreTags), "");
        }
    }
    //e.g. ATTRIBUTE_NODE should not give any text
    return "";
}

module.exports = {
    getTextFromNode
}