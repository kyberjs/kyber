const utils = require('./utils');
const Environment = require('./environment');
const loaders = require('./loaders');

let instance = null;

const kyber = {
    configure(templatesPath, options = {}) {
        if (utils.isObject(templatesPath)) {
            options = templatesPath;
            templatesPath = null;
        }

        const TemplateLoader = new loaders.FileLoader(templatesPath, options);
        instance = new Environment(TemplateLoader, options);
        return instance;
    },

    render(name, ctx) {
        if (!instance) {
            kyber.configure();
        }

        return instance.render(name, ctx);
    },

    renderString(src, ctx) {
        if (!instance) {
            kyber.configure();
        }

        return instance.renderString(src, ctx);
    },

    component(name, tplName) {
        if (!instance) {
            kyber.configure();
        }

        return instance.component(name, tplName);
    },

    compile(name) {
        if (!instance) {
            kyber.configure();
        }

        return instance.compile(name);
    },

    Environment
};

module.exports = kyber;
