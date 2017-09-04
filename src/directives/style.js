const defaultDirective = {
    parse(element, attr) {
        element._dynamicStyle = attr.value;
    },
    priority: 10,
    breakAfter: false
};

module.exports = defaultDirective;
