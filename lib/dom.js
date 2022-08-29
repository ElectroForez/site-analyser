function getTextFromNode(node, options={}) {
    /* returns textContext from dom element and his children */
    /*
    options
    sep (def="\n") - separator to text nodes.
    ignoreTags(def=["SCRIPT", "STYLE", "title"]) - text nodes in these tags will not included to result.
     */
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;

    const sep = options.sep || "\n";
    const ignoreTags = options.ignoreTags || ["SCRIPT", "STYLE", "title"];

    if (node.nodeType === TEXT_NODE) {
        return node.nodeValue + sep;
    }
    else if (node.nodeType === ELEMENT_NODE) {
        const childNodes = Array.from(node.childNodes);
        if (!ignoreTags.includes(node.tagName)) {
            return childNodes.reduce((prev, cur) => prev + getTextFromNode(cur, ignoreTags), "");
        }
    }
    //e.g. ATTRIBUTE_NODE should not give any text
    return "";
}

module.exports = {
    getTextFromNode
}