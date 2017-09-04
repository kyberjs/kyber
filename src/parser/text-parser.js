const filterParser = require('./filters-parser');

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
const regexEscapeRE = /[-.*+?^${}()|[\]/\\]/g;

const buildRegex = delimiters => {
    const open = delimiters[0].replace(regexEscapeRE, '\\$&');
    const close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
};

const parseText = function parseText(text, options) {
    const tagRE = options.delimiters ? buildRegex(options.delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
        return null;
    }

    const tokens = [];
    let lastIndex = tagRE.lastIndex = 0;
    let match = null;
    let index = 0;

    /* eslint no-cond-assign: "off" */
    while (match = tagRE.exec(text)) {
        index = match.index;

        // push text token
        if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        // tag token
        const exp = filterParser.parse(match[1].trim(), options.autoescape);
        tokens.push(`_str(${exp})`);
        lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return tokens.join('+');
};

exports.parse = parseText;
