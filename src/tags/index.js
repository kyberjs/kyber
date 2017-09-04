const baseTags = require('./base');
const htmlTags = require('./html');
const template = require('./template');
const importTag = require('./import');
const inherit = require('./inherit');
const setTag = require('./set');

const Tags = class Tags {
    constructor(env) {
        this.env = env;
        this._tags = {};
        this._unary = new Set();
        this._plain = new Set();
        this._preformatted = new Set();
        this._inline = new Set();
    }

    setTag(name, params) {
        name = name.toLowerCase();
        this._tags[name] = params;
        params.unary ? this._unary.add(name) : this._unary.delete(name);
        params.plain ? this._plain.add(name) : this._plain.delete(name);
        params.preformatted ? this._preformatted.add(name) : this._preformatted.delete(name);
        params.inline ? this._inline.add(name) : this._inline.delete(name);
    }

    removeTag(name) {
        if (this._tags[name]) {
            delete this._tags[name];
        }

        this._unary.delete(name);
        this._plain.delete(name);
        this._preformatted.delete(name);
        this._inline.delete(name);
    }

    isUnaryTag(name, defaultValue = false) {
        if (!this._tags[name]) {
            return defaultValue;
        }

        return this._unary.has(name);
    }

    isPlainTag(name, defaultValue = false) {
        if (!this._tags[name]) {
            return defaultValue;
        }

        return this._plain.has(name);
    }

    isPreformattedTag(name, defaultValue = false) {
        if (!this._tags[name]) {
            return defaultValue;
        }

        return this._preformatted.has(name);
    }

    isInlineTag(name, defaultValue = false) {
        if (!this._tags[name]) {
            return defaultValue;
        }

        return this._inline.has(name);
    }

    parseTransforms(root) {
        const _this = this;
        const tags = this._tags;
        const nodeType = root.constructor.nodeType;
        const transform = function transform(element) {
            if (element.nodeType !== nodeType.ELEMENT_NODE) {
                return;
            }

            const name = element.tag;

            if (!tags[name]) {
                console.warn('use un register tag.', name);
            }

            const tagProcess = tags[name] || tags._base;
            if (tagProcess.transform) {
                tagProcess.transform(element, _this.env);
            }

            return element._children.forEach(child => transform(child));
        };

        return root._children.forEach(child => transform(child));
    }

    compile(element, template, children, superTpl) {
        const name = element.tag;
        const tagProcess = this._tags[name] || this._tags._base;
        if (!tagProcess.compile) {
            console.warn('tag need compile handler');
        }

        return tagProcess.compile(element, children, this.env, template, superTpl);
    }
};

Tags.initBuildinTag = function initBuildinTag(tags) {
    tags.setTag('_base', baseTags);
    htmlTags.each((tagName, options) => {
        tags.setTag(tagName, options);
    });

    tags.setTag('template', template);
    tags.setTag('import', importTag);

    tags.setTag('extend', inherit.extend);
    tags.setTag('block', inherit.block);
    tags.setTag('slot', inherit.slot);

    tags.setTag('set', setTag);
};

module.exports = Tags;
