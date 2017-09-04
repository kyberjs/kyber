const parser = require('./parser');

const Compiler = class Compiler {
    constructor(template, options, env, parent) {
        this.env = env;
        this.options = options;
        this.template = template;
        this.parent = parent;
        this.ast = parser.parse(template.tmpl, env.tags, env.directives, this.options);
    }

    async compile() {
        this.code = await this.ast.compile(this.env, this.template, this.parent);
    }

    async render(ctx) {
        const AsyncFunction = Object.getPrototypeOf(async () => null).constructor;

        try {
            /* eslint no-new-func: "off" */
            const ret = new AsyncFunction(`with(this){return ${this.code};}`);
            return await ret.bind(ctx.context())();
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = Compiler;
