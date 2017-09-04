const Base = require('./base');
const textParser = require('../text-parser');

const collapseWhitespaceAll = function collapseWhitespaceAll(str) {
    if (str) {
        return str.replace(/\s+/g, spaces => {
            return spaces === '\t' ? '\t' : spaces.replace(/(^|\xA0+)[^\xA0]+/g, '$1 ');
        });
    }

    return str;
};

const collapseWhitespace = function collapseWhitespace(str, options, trimLeft, trimRight) {
    let lineBreakBefore = '';
    let lineBreakAfter = '';

    if (options.preserveLineBreaks) {
        str = str.replace(/^\s*?[\n\r]\s*/, () => {
            lineBreakBefore = '\n';
            return '';
        }).replace(/\s*?[\n\r]\s*$/, () => {
            lineBreakAfter = '\n';
            return '';
        });
    }

    if (trimLeft) {
        str = str.replace(/^\s+/, spaces => {
            const conservative = !lineBreakBefore && options.conservativeCollapse;
            if (conservative && spaces === '\t') {
                return '\t';
            }
            return spaces.replace(/^[^ ]+/, '').replace(/( +)[^ ]+/g, '$1 ') || (conservative ? ' ' : '');
        });
    }

    if (trimRight) {
        str = str.replace(/\s+$/, spaces => {
            const conservative = !lineBreakAfter && options.conservativeCollapse;
            if (conservative && spaces === '\t') {
                return '\t';
            }
            return spaces.replace(/[^ ]+( +)/g, '$1 ').replace(/[^ ]+$/, '') || (conservative ? ' ' : '');
        });
    }

    if (trimLeft && trimRight) {
        str = str.replace(/(\s+$)|(^\s+)/, '');
    }

    str = collapseWhitespaceAll(str);
    return lineBreakBefore + str + lineBreakAfter;
};

const Text = class Text extends Base {
    constructor(text, parent) {
        super(Base.TEXT_NODE, parent);
        this.text = text;
    }

    compile() {
        return this.expression || JSON.stringify(this.text);
    }

    trim(type = 0) {
        type = type % 3 || 0;
        const typeList = ['trim', 'trimLeft', 'trimRight'];
        this.text = this.text[typeList[type]]();

        if (this.parseOpt) {
            this.expression = textParser.parse(this.text, this.parseOpt);
        }

        return this.text;
    }

    collapse(options, tags, inPreformatted) {
        if (inPreformatted) {
            return;
        }

        if (!options.collapseWhitespace) {
            return;
        }

        if (tags.isPlainTag(this.parent.tag)) {
            return;
        }

        const prevEl = this.prevElement(Base.ELEMENT_NODE);
        const nextEl = this.nextElement(Base.ELEMENT_NODE);
        const trimLeft = !(prevEl && tags.isInlineTag(prevEl.tag));
        const trimRight = !(nextEl && tags.isInlineTag(nextEl.tag));

        if (!tags.isInlineTag(this.parent.tag)) {
            this.text = collapseWhitespace(this.text, options, trimLeft, trimRight);
        } else {
            this.text = collapseWhitespace(this.text, options, false, false);
        }
    }

    parseExpression(options) {
        this.parseOpt = options;
        this.expression = textParser.parse(this.text, options);
    }
};

module.exports = Text;
