const baseDirectives = require('./base');
const defaultDirective = require('./default');
const literalDirective = require('./literal');
const classDirective = require('./class');
const styleDirective = require('./style');
const stripDirective = require('./strip');

const Directives = class Directives {
    constructor(env) {
        this.env = env;
        this._directives = {};
    }

    setDirective(name, params) {
        name = name.toLowerCase();
        this._directives[name] = params;
    }

    removeDirective(name) {
        if (this._directives[name]) {
            delete this._directives[name];
        }
    }

    get(name) {
        const directive = this._directives[name];
        return directive || defaultDirective;
    }

    compile(name, exp, element, template) {
        const directive = this.get(name);

        if (!directive.compile) {
            console.warn('tag need compile handler');
        }

        return directive.compile(exp, element, this.env, template);
    }
};

Directives.initBuildinDirective = function initBuildinDirective(directives) {
    directives.setDirective('if', baseDirectives.if);
    directives.setDirective('for', baseDirectives.for);
    directives.setDirective('else', baseDirectives.else);
    directives.setDirective('elseif', baseDirectives.elseif);
    directives.setDirective('literal', literalDirective);
    directives.setDirective('class', classDirective);
    directives.setDirective('style', styleDirective);
    directives.setDirective('strip', stripDirective);
};

module.exports = Directives;
