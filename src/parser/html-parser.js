// Copyright 2004 Erik Arvidsson. All Rights Reserved.
// http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
/*
const handler ={
    startElement:   function (tagName, oAttrs) {},
    endElement:     function (tagName) {},
    characters:     function (s) {},
    comment:        function (s) {}
};
*/

const doctypeRe = /^<!doctype([^>]*)>/im;
const startTagRe = /^<([^>\s/]+)((\s+[^=>\s/]+(\s*=\s*(("[^"]*")|('[^']*')|[^>\s/]+))?)*)\s*(\/?)\s*>/m;
const endTagRe = /^<\/([^>\s]+)[^>]*>/m;
const attrRe = /([^=\s]+)(\s*=\s*(("([^"]*)")|('([^']*)')|[^>\s]+))?/gm;

const htmlParser = {
    contentHandler: {
        startElement: () => null,
        endElement: () => null,
        characters: () => null,
        comment: () => null
    },
    parse(html, handler) {
        if (handler) {
            htmlParser.contentHandler = handler;
        }

        let treatAsChars = false;
        while (html.length > 0) {
            // Comment
            if (html.substring(0, 4) === '<!--') {
                const index = html.indexOf('-->');
                if (index !== -1) {
                    const comment = html.substring(4, index);
                    html = html.substring(index + 3);
                    htmlParser.contentHandler.comment(comment, `<!--${comment}-->`);
                    treatAsChars = false;
                } else {
                    treatAsChars = true;
                }
            } else if (html.substring(0, 2) === '</') { // end tag
                if (endTagRe.test(html)) {
                    const lastMatch = RegExp.lastMatch;
                    const rightContext = RegExp.rightContext;

                    lastMatch.replace(endTagRe, (...args) => htmlParser.parseEndTag(...args));

                    html = rightContext;
                    treatAsChars = false;
                } else {
                    treatAsChars = true;
                }

            } else if (html.substring(0, 2) === '<!') { // doctype
                if (doctypeRe.test(html)) {
                    htmlParser.contentHandler.doctype(RegExp.lastMatch);
                    html = RegExp.rightContext;

                    treatAsChars = false;
                } else {
                    treatAsChars = true;
                }
            } else if (html.charAt(0) === '<') { // start tag
                if (startTagRe.test(html)) {
                    const lastMatch = RegExp.lastMatch;
                    const rightContext = RegExp.rightContext;

                    lastMatch.replace(startTagRe, (...args) => htmlParser.parseStartTag(...args));

                    html = rightContext;
                    treatAsChars = false;
                } else {
                    treatAsChars = true;
                }
            }

            if (treatAsChars) {
                const index = html.indexOf('<');
                if (index === -1) {
                    htmlParser.contentHandler.characters(html);
                    html = '';
                } else {
                    htmlParser.contentHandler.characters(html.substring(0, index));
                    html = html.substring(index);
                }
            }

            treatAsChars = true;
        }
    },

    parseStartTag(tag, tagName, rest, ...args) {
        const selfClosing = !!args[5];
        const attrs = htmlParser.parseAttributes(tagName, rest);
        htmlParser.contentHandler.startElement(tagName, attrs, tag, rest, selfClosing);
    },

    parseEndTag(tag, tagName) {
        htmlParser.contentHandler.endElement(tagName, tag);
    },

    parseAttributes(tagName, str) {
        const oThis = this;
        const attrs = [];
        str.replace(attrRe, function replace(a0, a1, a2, a3, a4, a5, a6) {
            attrs.push(oThis.parseAttribute(tagName, a0, a1, a2, a3, a4, a5, a6));
        });
        return attrs;
    },

    parseAttribute(tagName, attribute, name, ...args) {
        let value = '';
        if (args[4]) {
            value = args[5];
        } else if (args[2]) {
            value = args[3];
        } else if (args[0]) {
            value = args[1];
        }

        const empty = !value && !args[0];
        return {name, value: empty ? null : value};
    }
};

module.exports = htmlParser;
