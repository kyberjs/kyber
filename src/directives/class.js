const defaultDirective = {
    parse(element, attr) {
        element._dynamicClass = attr.value;
    },
    priority: 10,
    breakAfter: false
};

module.exports = defaultDirective;
