const defaultOptions = {
    sep: "\n",
    ignoreTags: ["SCRIPT", "STYLE", "title"],
};
export function getTextFromNode(node, options = defaultOptions) {
    /* returns textContext from dom element and his children */
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;
    options = {
        ...defaultOptions,
        ...options
    };
    if (node.nodeType === TEXT_NODE) {
        return node.nodeValue + options.sep;
    }
    else if (node.nodeType === ELEMENT_NODE) {
        const childNodes = Array.from(node.childNodes);
        if (!options.ignoreTags.includes(node.nodeName)) {
            return childNodes.reduce((prev, cur) => prev + getTextFromNode(cur, options), "");
        }
    }
    return "";
}
