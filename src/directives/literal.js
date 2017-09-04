const literalDirective = {
    parse(element, attr, tags) {
        if (!tags.isPlainTag(element.tag)) {
            return console.warn('literal directive must be use in a plain tag');
        }
        element.literal = true;
    },
    priority: 20,
    breakAfter: true
};

module.exports = literalDirective;
