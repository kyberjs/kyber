const utils = require('../../utils');
const Base = require('./base');

const shortDoctype = '<!doctype HTML>';
const Doctype = class Doctype extends Base {
    constructor(doctype, parent) {
        super(Base.DOCUMENT_TYPE_NODE, parent);
        this.text = doctype;
    }

    compile(env, template) {
        const text = template.options.useShortDoctype ? shortDoctype : this.text;
        return new utils.Code().encode(text);
    }
};

module.exports = Doctype;
