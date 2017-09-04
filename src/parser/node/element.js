const utils = require('../../utils');
const Base = require('./base');

const Element = class Element extends Base {
    constructor(tag, attrs, parent) {
        super(Base.ELEMENT_NODE, parent);
        this.tag = tag;
        this.attrsList = attrs;

        this.makeAttrsMap();
        this._children = [];
        this._directives = {};
        this._dSet = new Set();
    }

    async compile(env, template, superTpl) {
        const children = await this.compileChildren(env, template, superTpl);
        let tag = await this.compileTag(env, template, children, superTpl);

        for (const key of this._dSet) {
            const value = this._directives[key];
            tag = await env.directives.compile(key, value, this, template);
        }

        return tag;
    }

    // env, template, children
    compileTag(env, ...args) {
        return env.compileTag(this, ...args);
    }

    makeAttrsMap() {
        const map = {};

        this.attrsList.forEach(attr => {
            if (map[attr.name]) {
                this.warn('duplicate attribute: ' + attr.name);
            }

            map[attr.name] = attr;
        });

        this.attrsMap = map;
    }

    removeAttr(name) {
        const index = this.attrsList.findIndex(item => item.name === name);
        this.attrsList.splice(index, 1);
        delete this.attrsMap[name];
        return index;
    }

    addAttr(attr, index = -1) {
        if (this.attrsMap[attr.name]) {
            console.warn('duplicate attribute: ' + attr.name);
        }

        this.attrsMap[attr.name] = attr;
        index > -1 ? this.attrsList.splice(index, 0, attr) : this.attrsList.push(attr);
    }

    addDirective(name, value) {
        this._directives = {};
        if (this._dSet.has(name)) {
            this.warn('duplicate directive: ' + name);
        }

        this._dSet.add(name);
        this._directives[name] = value;
    }

    hasDirective(name) {
        return this._dSet.has(name);
    }

    setNS(ns) {
        if (ns) {
            this.ns = ns;
        }
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

    addChild(node) {
        this._children.push(node);
    }

    removeChild(index = 0) {
        if (!utils.isNumber(index)) {
            index = this._children.findIndex(item => item === index);
        }

        if (index < 0) {
            return false;
        }

        this._children.splice(index, 1);
        return true;
    }

    findPrevElement(remove) {
        const willRemove = [];
        const children = this.parent._children;
        let prev = null;

        for (let index = children.length; index > 0; index--) {
            const child = children[index - 1];
            if (child.nodeType === Base.ELEMENT_NODE) {
                prev = child;
                break;
            }

            if (child.nodeType === Base.TEXT_NODE) {
                if (!utils.isWhiteSpace(child.text)) {
                    console.warn(`text "${child.text.trim()}" between if, for and else(-if) will be ignored.`);
                }

                willRemove.push(remove ? child : null);
            }
        }

        willRemove.forEach(item => {
            return item && item.remove();
        });

        return prev;
    }

    addIfCondition(key, exp, block) {
        this.ifConditions = this.ifConditions || [];
        this.ifConditions.push({key, exp, block});
    }
};

module.exports = Element;
