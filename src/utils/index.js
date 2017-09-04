const TemplateError = require('./template-error');
const Code = require('./code');

const ObjectProto = Object.prototype;

const makeMap = function makeMap(str, lower) {
    const set = new Set(str.split(','));
    return val => set.has(lower ? val.toLowerCase() : val);
};

let valIndex = 0;

const utils = {
    isNumber(obj) {
        return ObjectProto.toString.call(obj) === '[object Number]';
    },

    isObject(obj) {
        return ObjectProto.toString.call(obj) === '[object Object]';
    },

    isArray(obj) {
        return ObjectProto.toString.call(obj) === '[object Array]';
    },

    isString(obj) {
        return ObjectProto.toString.call(obj) === '[object String]';
    },

    isFunction(obj) {
        return ObjectProto.toString.call(obj) === '[object Function]';
    },

    prettifyError(path, withInternals, err) {
        console.log(err);
        if (!err.update) {
            err = new TemplateError(err);
        }

        err.update(path);

        if (!withInternals) {
            const old = err;
            err = new Error(old.message);
            err.name = old.name;
        }

        return err;
    },

    isWhiteSpace(val) {
        return val.match(/^[ \n\t\r\u00A0]+$/);
    },

    genVal() {
        return '__$kyber_' + valIndex++;
    },

    camelcase(str) {
        if (str.indexOf('-') === -1) {
            return str;
        }

        return str.toLowerCase().replace(/-([a-z])/i, (all, first) => first.toUpperCase());
    },

    makeMap,

    Code
};

module.exports = utils;
