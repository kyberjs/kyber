const Base = require('./base');

const Document = class Document extends Base {
    constructor() {
        super(Base.DOCUMENT_NODE);
        this._children = [];
    }

    toString() {
        return this._children.map(child => {
            return child.toString();
        }).join('');
    }

    compile(...args) {
        return this.compileChildren(...args);
    }

    addDoctype(doctypeElement) {
        if (this.doctype) {
            return;
        }

        this.doctype = doctypeElement;
        this._children.push(doctypeElement);
    }

    get firstChild() {
        return this._children[0] || null;
    }

    get lastChild() {
        if (this._children.length) {
            return this._children[this._children.length - 1];
        }

        return null;
    }

    addChild(childElement) {
        this._children.push(childElement);
    }
};

module.exports = Document;
