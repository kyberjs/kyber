const utils = require('../utils');

const compileAttrs = function compileAttrs(attrs, element, env, template) {
    const attrCode = new utils.Code();
    const quote = template.options.quoteCharacter;
    const removeEmpty = template.options.removeEmptyAttributes;

    attrs.forEach(attr => {
        const name = ' ' + attr.name;
        let value = null;

        // class 特殊处理
        if (!value && attr.name === 'class' && element._dynamicClass) {
            value = `_class(${attrCode.encode(attr.value)},${element._dynamicClass})`;
        }

        // Style 特殊处理
        if (!value && attr.name === 'style' && element._dynamicStyle) {
            value = `_style(${attrCode.encode(attr.value)},${element._dynamicStyle})`;
        }

        if (!value && attr.expression) {
            value = attr.expression;
        }

        if (!value) {
            if (attr.value) {
                attrCode.add(`${name}=${quote}${attr.value}${quote}`, true);
            } else if (!removeEmpty) {
                attrCode.add(`${name}`, true);
            }

            return;
        }

        const valueCode = new utils.Code();

        valueCode.add(`${name}=${quote}`, true);
        valueCode.add(value);
        valueCode.add(quote, true);

        if (removeEmpty) {
            const emptyCode = new utils.Code();

            emptyCode.add('(await (async function(){');
            emptyCode.add(`if(${value})`);
            emptyCode.add(`{return ${valueCode.combine()};} else {return "";}`);
            emptyCode.add('}}())');
            return attrCode.add(emptyCode.combine(''));
        }

        attrCode.add(valueCode.combine());
    });

    return attrCode.combine();
};

module.exports = {
    plain: false,
    unary: false,
    compile(element, children, env, template) {
        const tagCode = new utils.Code();
        tagCode.add(`<${element.tag}`, true);
        tagCode.add(compileAttrs(element.attrsList, element, env, template));
        tagCode.add('>', true);
        tagCode.add(children);
        tagCode.add(`</${element.tag}>`, true);
        return tagCode.combine();
    },
    compileAttrs
};
