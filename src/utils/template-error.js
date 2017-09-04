const TemplateError = class TemplateError extends Error {
    constructor(message, lineno, colno) {
        super();
        let err = this;

        if (message instanceof Error) {
            err = message;
            message = message.name + ': ' + message.message;
        } else {
            if (Error.captureStackTrace) {
                Error.captureStackTrace(err);
            }
        }

        err.name = 'Template render error';
        err.message = message;
        err.lineno = lineno;
        err.colno = colno;
        err.firstUpdate = true;
    }

    update(path) {
        let message = '(' + (path || 'unknown path') + ')';

        if (this.firstUpdate) {
            if (this.lineno && this.colno) {
                message += ' [Line ' + this.lineno + ', Column ' + this.colno + ']';
            } else if (this.lineno) {
                message += ' [Line ' + this.lineno + ']';
            }
        }

        message += '\n ';
        if (this.firstUpdate) {
            message += ' ';
        }

        this.message = message + (this.message || '');
        this.firstUpdate = false;
        return this;
    }
};

module.exports = TemplateError;
