module.exports = {
    async compile(element, children, env, template) {
        const name = element.attrsList.find(attr => attr.name === 'name');
        if (!name) {
            return console.warn('import need name attribute');
        }

        const tmpl = await env.getTemplate(name.value, false, template.name);
        await tmpl.compile();
        const childCode = tmpl.props.code;

        if (children && childCode) {
            return `(await (async function(){if(${childCode}){return ${childCode};}else{return ${children};}}()))`;
        }

        return childCode !== '""' ? childCode : children;
    }
};
