const stripDirective = {
    parse(element) {
        const trimChildren = function trimChildren(child, type) {
            if (child.nodeType === 3) {
                const text = child.trim(type);
                if (!text) {
                    element.removeChild(child);
                }
            }
        };

        trimChildren(element.firstChild, 1);
        trimChildren(element.lastChild, 2);
    },
    priority: 10,
    breakAfter: false
};

module.exports = stripDirective;
