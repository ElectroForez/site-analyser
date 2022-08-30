function getTextFromNode(node, options={}) {
    /* returns textContext from dom element and his children */
    /*
    options
    sep (def="\n") - separator to text nodes.
    ignoreTags(def=["SCRIPT", "STYLE", "title"]) - text nodes in these tags will not included to result.
     */
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;

    options = {
        sep: "\n",
        ignoreTags: ["SCRIPT", "STYLE", "title"],
        ...options
    }

    if (node.nodeType === TEXT_NODE) {
        return node.nodeValue + options.sep;
    }
    else if (node.nodeType === ELEMENT_NODE) {
        const childNodes = Array.from(node.childNodes);
        if (!options.ignoreTags.includes(node.tagName)) {
            return childNodes.reduce((prev, cur) => prev + getTextFromNode(cur, options), "");
        }
    }
    //else e.g. ATTRIBUTE_NODE should not give any text
    return "";
}

module.exports = {
    getTextFromNode
}