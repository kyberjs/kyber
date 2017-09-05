// Copyright (c) 2013-present, Yuxi (Evan) You
// https://github.com/vuejs/vue/blob/dev/src/compiler/parser/filter-parser.js

/* eslint-disable */
const validDivisionCharRE = /[\w).+\-_$\]]/;

const wrapFilter = function wrapFilter(exp, filter) {
    const idx = filter.indexOf('(');
    if (idx < 0) {
        // _f: resolveFilter
        return `(await _filter("${filter}"))(${exp})`;
    }

    const name = filter.slice(0, idx);
    const args = filter.slice(idx + 1);
    return `(await _filter("${name}"))(${exp},${args}`;
};

const CHR = {
    PIPE: 0x7C
};

const parseFilters = function parseFilters(exp, autoescape) {
    let inSingle = false;
    let inDouble = false;
    let inTemplateString = false;
    let inRegex = false;
    let curly = 0;
    let square = 0;
    let paren = 0;
    let lastFilterIndex = 0;
    let charCode = 0;
    let prevCode = 0;
    let idx = 0;
    let expression = null;
    const filters = [];

    const pushFilter = function pushFilter() {
        filters.push(exp.slice(lastFilterIndex, idx).trim());
        lastFilterIndex = idx + 1;
    };

    for (; idx < exp.length; idx++) {
        prevCode = charCode;
        charCode = exp.charCodeAt(idx);

        const isPipe = charCode === CHR.PIPE && exp.charCodeAt(idx + 1) !== CHR.PIPE && exp.charCodeAt(idx - 1) !== CHR.PIPE;

        if (inSingle) {
            if (charCode === 0x27 && prevCode !== 0x5C) {
                inSingle = false;
            }
        } else if (inDouble) {
            if (charCode === 0x22 && prevCode !== 0x5C) {
                inDouble = false;
            }
        } else if (inTemplateString) {
            if (charCode === 0x60 && prevCode !== 0x5C) {
                inTemplateString = false;
            }
        } else if (inRegex) {
            if (charCode === 0x2f && prevCode !== 0x5C) {
                inRegex = false;
            }
        } else if (isPipe && !curly && !square && !paren) {
            if (!expression) {
                // first filter, end of expression
                lastFilterIndex = idx + 1;
                expression = exp.slice(0, idx).trim();
            } else {
                pushFilter();
            }
        } else {
            switch (charCode) {
                case 0x22: inDouble = true; break         // "
                case 0x27: inSingle = true; break         // '
                case 0x60: inTemplateString = true; break // `
                case 0x28: paren++; break                 // (
                case 0x29: paren--; break                 // )
                case 0x5B: square++; break                // [
                case 0x5D: square--; break                // ]
                case 0x7B: curly++; break                 // {
                case 0x7D: curly--; break                 // }
            }
            if (charCode === 0x2f) { // /
                let j = idx - 1;
                let p = 0;
                // find first non-whitespace prev char
                for (; j >= 0; j--) {
                    p = exp.charAt(j);
                    if (p !== ' ') break;
                }
                if (!p || !validDivisionCharRE.test(p)) {
                    inRegex = true;
                }
            }
        }
    }

    if (!expression) {
        expression = exp.slice(0, idx).trim();
    } else if (lastFilterIndex !== 0) {
        pushFilter();
    }

    if (expression.match(/\([^)]*\)/)) {
        expression = 'await ' + expression;
    }

    if (autoescape) {
        const safeIndex = filters.indexOf('safe');
        const escapeIndex = filters.indexOf('escape');
        if (safeIndex === -1) {
            if (escapeIndex === -1) {
                filters.push('escape');
            }
        } else {
            filters.splice(safeIndex, 1);
        }
    }

    if (filters) {
        for (idx = 0; idx < filters.length; idx++) {
            expression = wrapFilter(expression, filters[idx]);
        }
    }

    return expression;
};

exports.parse = parseFilters;
