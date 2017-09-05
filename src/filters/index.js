const utils = require('../utils');

const normalize = function normalize(value, defaultValue) {
    /* eslint no-undefined: "off" */
    if (value === null || value === undefined || value === false) {
        return defaultValue;
    }
    return value;
};

const filters = {
    abs: Math.abs,

    capitalize(str) {
        str = normalize(str, '');
        const ret = str.toLowerCase();

        return ret.charAt(0).toUpperCase() + ret.slice(1);
    },

    default(val, def, bool) {
        if (bool) {
            return val ? val : def;
        }

        return val !== undefined ? val : def;
    },

    dump(obj, spaces) {
        return JSON.stringify(obj, null, spaces);
    },

    escape(str) {
        const escapeMap = {'&': '&amp;', '"': '&quot;', '\'': '&#39;', '<': '&lt;', '>': '&gt;'};
        const escape = val => val.replace(/[&"'<>]/g, ch => escapeMap[ch]);

        return escape(normalize(str, '').toString());
    },

    safe(str) {
        return normalize(str, '').toString();
    },

    first(arr) {
        return arr[0];
    },

    join(arr, del, attr) {
        del = del || '';
        arr = attr ? arr.map(item => item[attr]) : arr;
        return arr.join(del);
    },

    last(arr) {
        return arr[arr.length - 1];
    },

    length(val) {
        const value = normalize(val, '');

        if (value) {
            if (value instanceof Map || value instanceof Set) {
                // ECMAScript 2015 Maps and Sets
                return value.size;
            }

            if (utils.isObject(value)) {
                // Objects (besides SafeStrings), non-primative Arrays
                return Object.keys(value).length;
            }

            return value.length;
        }

        return 0;
    },

    lower(str) {
        return normalize(str, '').toLowerCase();
    },

    nl2br(str) {
        return normalize(str, '').replace(/\r\n|\n/g, '<br />\n');
    },

    upper(str) {
        return normalize(str, '').toUpperCase();
    },

    wordcount(str) {
        str = normalize(str, '');

        const words = str ? str.match(/\w+/g) : null;
        return words ? words.length : null;
    },

    float(val, def) {
        const res = parseFloat(val);
        return isNaN(res) ? def : res;
    },

    int(val, def) {
        const res = parseInt(val, 10);
        return isNaN(res) ? def : res;
    }
};

// Aliases
filters.d = filters.default;
filters.e = filters.escape;

module.exports = filters;
