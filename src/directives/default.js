const filterParser = require('../parser/filters-parser');

const defaultDirective = {
    parse(element, attr, tags, index) {
        if (!attr.value) {
            return element.addAttr(attr, index);
        }

        const exp = filterParser.parse(attr.value.trim());
        const parsedAttr = {
            name: attr.key,
            expression: `_str(${exp})`
        };

        element.addAttr(parsedAttr, index);
    },
    priority: 10,
    breakAfter: false
};

module.exports = defaultDirective;
