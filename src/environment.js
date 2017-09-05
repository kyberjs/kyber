const utils = require('./utils');
const builtinLoaders = require('./loaders');
const Directives = require('./directives');
const builtinFilters = require('./filters');
const Tags = require('./tags');
const componentTag = require('./tags/component');
const Template = require('./template');

const defaultOptions = {
    collapseInlineTagWhitespace: true,
    conservativeCollapse: false,
    collapseWhitespace: true,
    preserveLineBreaks: false,
    quoteCharacter: '"',
    removeComments: true,
    removeEmptyAttributes: false,
    useShortDoctype: true,
    prefix: 'kyber-',
    autoescape: true,
    delimiters: ['{{', '}}'],
    watch: false,
    noCache: false,
    extName: 'html'
};

const Environment = class Environment {
    constructor(loaders, options = {}) {
        options.autoescape = options.autoescape != null ? options.autoescape : true;
        this.options = Object.assign({}, defaultOptions, options);

        this.loaders = [];

        if (!loaders) {
            this.loaders = [new builtinLoaders.FileLoader('views', options)];
        } else {
            this.loaders = utils.isArray(loaders) ? loaders : [loaders];
        }

        this.directives = new Directives(this);
        Directives.initBuildinDirective(this.directives);

        this.tags = new Tags(this);
        Tags.initBuildinTag(this.tags);

        this.filters = builtinFilters;
        this.globals = {};
        this.tpls = {};
    }

    addGlobal(name, value) {
        this.globals[name] = value;
        for (const key in this.tpls) {
            this.tpls[key].setVariable(name, value);
        }
        return this;
    }

    getGlobal(name) {
        if (typeof this.globals[name] === 'undefined') {
            throw new Error('global not found: ' + name);
        }

        return this.globals[name];
    }

    async compileTag(...args) {
        return await this.tags.compile(...args);
    }

    resolveTemplate(loader, parentName, filename) {
        const isRelative = loader.isRelative && parentName ? loader.isRelative(filename) : false;
        return isRelative && loader.resolve ? loader.resolve(parentName, filename) : filename;
    }

    async getTemplate(name, eagerCompile = false, parent = {}, ignoreMissing = false) {
        let tmpl = null;
        if (name instanceof Template) {
            tmpl = name;
        } else if (typeof name !== 'string') {
            throw new Error('template names must be a string: ' + name);
        }

        if (tmpl) {
            if (eagerCompile) {
                await tmpl.compile();
            }

            return tmpl;
        }

        for (let index = 0; index < this.loaders.length; index++) {
            const loader = this.loaders[index];
            name = this.resolveTemplate(loader, parent.name, name);
            const info = loader.getSource(name);
            if (!info && !ignoreMissing) {
                throw new Error('template not found: ' + name);
            }

            const tmpl = info ? new Template(info.src, this, name, info.path, parent, this.options) : new Template('', this, '', '', parent, this.options);

            return eagerCompile ? await tmpl.compile() : tmpl;
        }
    }

    async render(name, ctx) {
        const tmpl = this.tpls[name] || await this.getTemplate(name, true);
        this.tpls[name] = tmpl;
        return await tmpl.render(Object.assign({}, this.globals, ctx));
    }

    async renderString(src, ctx, options = {}) {
        const tmpl = new Template(src, this, options.name, options.path, null, this.options);
        this.tpls[options.name || 'inline'] = tmpl;
        return await tmpl.render(ctx);
    }

    compile(name) {
        return this.getTemplate(name, true);
    }

    component(component, name) {
        this.tags.setTag(component, componentTag(name));
    }
};

module.exports = Environment;
