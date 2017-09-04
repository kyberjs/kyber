const Runtime = require('./runtime');

const Context = class Context {
    constructor(ctx, env) {
        this.env = env;

        this.ctx = Object.create(null);
        for (const k in ctx) {
            if (ctx.hasOwnProperty(k)) {
                this.ctx[k] = ctx[k];
            }
        }

        const runtime = new Runtime(env);
        this._runtime = runtime.instence();
    }

    setVariable(name, val) {
        this.ctx[name] = val;
    }

    context() {
        const handler = {
            get(target, name) {
                if (target[name]) {
                    return target[name];
                }

                return null;
            },
            set() {
                return false;
            },
            has() {
                return true;
            }
        };

        return new Proxy(Object.assign({}, this.ctx, this._runtime), handler);
    }
};

module.exports = Context;
