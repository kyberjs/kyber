const Code = class Code {
    constructor() {
        this._line = [];
    }

    add(text, encode) {
        if (text) {
            this._line.push(encode ? this.encode(text) : text);
        }
    }

    addIf(bool, text, elseText) {
        if (bool) {
            return this.add(text);
        }

        return this.add(elseText);
    }

    encode(text) {
        return JSON.stringify(text);
    }

    combine(separator = '+') {
        return this._line.join(separator);
    }
};

module.exports = Code;
