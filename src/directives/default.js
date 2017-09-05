const utils = require('../utils');
const filterParser = require('../parser/filters-parser');

const defaultDirective = {
    parse(element, attr, tags, index) {
        if (!attr.value) {
            return element.addAttr({name: utils.kebabcase(attr.key)}, index);
        }

        const exp = filterParser.parse(attr.value.trim());
        const parsedAttr = {
            name: utils.kebabcase(attr.key),
            expression: `_str(${exp})`
        };

        element.addAttr(parsedAttr, index);
    },
    priority: 10,
    breakAfter: false
};

module.exports = defaultDirective;
