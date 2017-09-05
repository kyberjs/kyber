const utils = require('../utils');
const htmlParser = require('./html-parser');

const {Element, Doctype, Document, Text, Comment, nodeType} = require('./node');

const parser = {
    parse(template, tags, directives, options) {
        const stack = [];
        const root = new Document();
        let currentParent = root;
        let plainTagName = '';
        let inPreformattedTag = false;

        // 解析指令
        const parseDirective = function parseDirective(element) {
            const prefix = options.prefix;
            const len = prefix.length;

            element.attrsList.filter(attr => {
                const isPrefix = attr.name.startsWith(prefix);
                attr.key = utils.camelcase(attr.name.substr(len));

                return isPrefix;
            }).sort((prev, next) => {
                return directives.get(next.key).priority - directives.get(prev.key).priority;
            }).forEach(attr => {
                const index = element.removeAttr(attr.name);
                directives.get(attr.key).parse(element, attr, tags, index);
            });

            return element;
        };

        const handles = {
            doctype(doctype) {
                if (currentParent === root) {
                    const element = new Doctype(doctype, root);
                    root.addDoctype(element);
                }
            },

            startElement(tagName, attrs, tag, rest, selfClosing) {
                // 在 textarea 等标签内，不解析内部结构
                if (plainTagName) {
                    return handles.characters(tag);
                }

                // 解析普通元素
                const element = new Element(tagName, attrs, currentParent);

                // 自闭和元素
                if (selfClosing || tags.isUnaryTag(tagName)) {
                    parseDirective(element);
                    return currentParent.addChild(element);
                }

                if (tags.isPlainTag(tagName)) {
                    plainTagName = tagName;
                }

                if (tags.isPreformattedTag(tagName)) {
                    inPreformattedTag = true;
                }

                currentParent = element;
                stack.push(element);
            },

            endElement(tagName, tag) {
                // 在 textarea 等标签内，不解析内部结构
                if (plainTagName && plainTagName !== tagName) {
                    return handles.characters(tag);
                }

                plainTagName = '';
                const currentElement = stack[stack.length - 1];
                parseDirective(currentElement);

                if (!currentElement.literal) {
                    currentElement._children.forEach(child => {
                        if (child.nodeType === nodeType.TEXT_NODE) {
                            child.collapse(options, tags, inPreformattedTag);
                            child.parseExpression(options);
                        }
                    });
                }

                if (tags.isPreformattedTag(tagName)) {
                    inPreformattedTag = false;
                }

                // pop stack
                stack.length -= 1;
                currentParent = stack.length ? stack[stack.length - 1] : root;
                currentParent.addChild(currentElement);
            },
            characters(text) {
                if (currentParent.lastChild && currentParent.lastChild.nodeType === nodeType.TEXT_NODE) {
                    currentParent.lastChild.text += text;
                    return;
                }

                currentParent.addChild(new Text(text, currentParent));
            },

            comment(comment, commentStr) {
                const isConditional = function isConditional(text) {
                    return /^\[if\s[^\]]+]|\[endif]$/.test(text);
                };

                if (plainTagName) {
                    return handles.characters(commentStr);
                }

                if (comment.trim().startsWith('//')) {
                    return;
                }

                if (isConditional(comment) || !options.removeComments) {
                    return currentParent.addChild(new Comment(comment, currentParent));
                }
            }
        };

        htmlParser.parse(template, handles);
        root._children.forEach(child => {
            if (child.nodeType === nodeType.TEXT_NODE) {
                child.collapse(options, tags, inPreformattedTag);
                child.parseExpression(options);
            }
        });
        tags.parseTransforms(root);
        return root;
    }
};

module.exports = parser;
