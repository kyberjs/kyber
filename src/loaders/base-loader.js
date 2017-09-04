const path = require('path');

const BaseLoader = class BaseLoader {
    on(name, func) {
        this.listeners = this.listeners || {};
        this.listeners[name] = this.listeners[name] || [];
        this.listeners[name].push(func);
    }

    emit(name, ...args) {
        if (this.listeners && this.listeners[name]) {
            this.listeners[name].forEach(listener => listener(...args));
        }
    }

    resolve(from, to) {
        return path.resolve(path.dirname(from), to);
    }

    isRelative(filename) {
        return filename.indexOf('./') === 0 || filename.indexOf('../') === 0;
    }
};

module.exports = BaseLoader;
