const nodeType = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11
};

const Node = class Node {
    constructor(nodeType, parent) {
        this.nodeType = nodeType;
        this.parent = parent || null;
    }

    toString() {
        return '';
    }

    async compileChildren(env, template, superTpl) {
        const children = await Promise.all(this._children.map(child => child.compile(env, template, superTpl)));
        return children.filter(item => !!item).join('+');
    }

    warn(...args) {
        console.warn(...args);
    }

    remove() {
        const index = this.parent._children.findIndex(item => item === this);
        this.parent._children.splice(index, 1);
    }

    prevElement(nodeType) {
        let index = this.parent._children.findIndex(item => item === this);
        for (; index > 0; index--) {
            if (!nodeType || this.parent._children[index - 1].nodeType === nodeType) {
                return this.parent._children[index - 1];
            }
        }

        return null;
    }

    nextElement(nodeType) {
        let index = this.parent._children.findIndex(item => item === this);
        for (; index < this.parent._children.length - 1; index++) {
            if (!nodeType || this.parent._children[index + 1].nodeType === nodeType) {
                return this.parent._children[index + 1];
            }
        }

        return null;
    }
};

Object.assign(Node, nodeType, {nodeType});
module.exports = Node;
