const utils = require('../utils');

module.exports = function component(name) {
    return {
        async compile(element, children, env, template) {
            const parameter = [];
            const argument = new utils.Code();

            element.attrsList.forEach(item => {
                parameter.push(utils.camelcase(item.name));
                if (item.expression) {
                    argument.add(item.expression);
                } else {
                    argument.add(item.value, true);
                }
            });

            const tmpl = await env.getTemplate(name, false, template.name);
            await tmpl.compile();
            const childCode = tmpl.props.code || '""';
            children = children || '""';

            return [
                '(await (async function(',
                parameter.join(','),
                `){if(${childCode}){return ${childCode};}else{return ${children};}}(`,
                argument.combine(',') + ')))'
            ].join('');
        }
    };
};
