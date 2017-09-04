const utils = require('./utils');
const Context = require('./context');
const Compiler = require('./compiler');

const Template = class Template {
    constructor(src, env, name, path, parent, options) {
        this.env = env;
        this.name = name;
        this.parent = parent;
        this._context = null;
        this.variable = {};
        this.options = options;

        if (utils.isObject(src)) {
            switch (src.type) {
                case 'code': {
                    this.props = src.obj;
                    break;
                }

                case 'string': {
                    this.tmpl = src.obj;
                    break;
                }

                default: {
                    throw new Error('src.type must be a in string & code');
                }
            }
        } else if (utils.isString(src)) {
            this.tmpl = src;
        } else {
            throw new Error('src must be a string or an object describing the source');
        }

        this.path = path;
        this.compiled = false;
    }

    async render(ctx) {
        try {
            await this.compile();
        } catch (_err) {
            throw utils.prettifyError(this.path, this.env.opts.dev, _err);
        }

        this._context = new Context(Object.assign({}, this.variable, ctx || {}), this.env);
        return this.props.render(this._context);
    }

    setVariable(name, value) {
        this.variable[name] = value;
        if (this._context) {
            this._context.setVariable(name, value);
        }
    }

    async compile() {
        return this.compiled ? null : await this._compile();
    }

    async _compile() {
        if (!this.props) {
            try {
                this.props = new Compiler(this, this.options, this.env, this.parent);
                await this.props.compile();
                this.compiled = true;
            } catch (err) {
                throw utils.prettifyError(this.path, this.env.opts.dev, err);
            }
        }

        return this;
    }
};

module.exports = Template;
