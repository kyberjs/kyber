const utils = require('../utils');

const ifDirective = {
    async compile(exp, element, env, template) {
        const ifCode = new utils.Code();
        ifCode.add('(await (async function(){');
        let hasElse = false;

        const handle = async function handle(condition) {
            const children = await condition.block.compileChildren(env, template);
            const tag = await condition.block.compileTag(env, template, children);

            ifCode.addIf(condition.key === 'if', `if(${condition.exp}){return ${tag};}`);
            ifCode.addIf(condition.key === 'elseif', `else if(${condition.exp}){return ${tag};}`);

            if (condition.key === 'else') {
                hasElse = true;
                ifCode.add(`else{return ${tag};}`);
            }
        };

        await Promise.all(element.ifConditions.map(condition => handle(condition)));

        ifCode.addIf(!hasElse, 'else {return "";}');
        ifCode.add('}()))');
        return ifCode.combine('');
    },

    parse(element, attr) {
        element.addDirective(attr.key, attr.value);
        element.addIfCondition(attr.key, attr.value, element);
    },
    priority: 10,
    breakAfter: false
};

const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;
const forDirective = {
    async compile(exp, element, env, template) {
        const children = await element.compileChildren(env, template);
        const forCode = new utils.Code();
        forCode.add('(await (async function(){');

        const empty = utils.genVal();
        forCode.add(`let ${empty}=true;`);

        const iterator1 = exp.iterator1 || utils.genVal();
        const iterator2 = exp.iterator2 || utils.genVal();
        const list = utils.genVal();
        forCode.add(`const ${list} = [];`);
        forCode.add(`if(${exp.for} && _type(${exp.for}, 'array')) {
            for(let ${iterator1} = 0; ${iterator1} < ${exp.for}.length; ${iterator1}++) {
                ${empty} = false;
                const ${exp.alias} = ${exp.for}[${iterator1}];
                ${list}.push(${children});
            }
        }`);

        forCode.add(`if(${exp.for} && _type(${exp.for}, 'object')) {
            let ${iterator2} = 0;
            for(const ${iterator1} in ${exp.for}) {
                if (${exp.for}.hasOwnProperty(${iterator1})) {
                    ${empty} = false;
                    const ${exp.alias} = ${exp.for}[${iterator1}];
                    ${list}.push(${children});
                    ${iterator2}++;
                }
            }
        }`);

        forCode.add(`if (!${empty}) {return ${list}.join('');}`);
        forCode.add('return "";}()))');

        return await element.compileTag(env, template, forCode.combine(''));
    },
    parse(element, attr) {
        const inMatch = attr.value.match(forAliasRE);
        if (!inMatch) {
            return console.warn(`Invalid for expression: ${attr.value}`);
        }

        const params = {
            'for': inMatch[2].trim()
        };

        const alias = inMatch[1].trim();
        const iteratorMatch = alias.match(forIteratorRE);

        if (iteratorMatch) {
            params.alias = iteratorMatch[1].trim();
            params.iterator1 = iteratorMatch[2].trim();
            if (iteratorMatch[3]) {
                params.iterator2 = iteratorMatch[3].trim();
            }
        } else {
            params.alias = alias;
        }

        element.addDirective(attr.key, params);
    },
    priority: 10,
    breakAfter: true
};

const elseDirective = {
    compile() {
        return '""';
    },

    parse(element, attr) {
        const prev = element.findPrevElement(true);

        if (!prev || !(prev.hasDirective('if') || prev.hasDirective('elseif'))) {
            element.addDirective(attr.key, null);
            return console.warn(`"else" used on <${element.tag}> without corresponding "if" or "elseif".`);
        }

        element.addDirective(attr.key, null);
        prev.addIfCondition(attr.key, null, element);
    },
    priority: 10,
    breakAfter: true
};

const elseifDirective = {
    compile() {
        return '""';
    },
    parse(element, attr) {
        const prev = element.findPrevElement(true);

        if (!prev || !(prev.hasDirective('if') || prev.hasDirective('elseif'))) {
            element.addDirective(attr.key, attr.value);
            return console.warn(`"else-if" used on <${element.tag}> without corresponding "if" or "elseif".`);
        }

        element.addDirective(attr.key, attr.value);
        prev.addIfCondition(attr.key, attr.value, element);
    },
    priority: 10,
    breakAfter: true
};

module.exports = {
    'if': ifDirective,
    'for': forDirective,
    'else': elseDirective,
    'elseif': elseifDirective
};
