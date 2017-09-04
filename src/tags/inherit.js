exports.extend = {
    unary: true,
    transform(element) {
        const nodeType = element.constructor.nodeType;
        const blocks = {};

        const trimChildren = function trimChildren(child, type) {
            if (child.nodeType === 3) {
                const text = child.trim(type);
                if (!text) {
                    element.removeChild(child);
                }
            }
        };

        // 解析所有 block
        element.parent._children.forEach(block => {
            if (block.nodeType !== nodeType.ELEMENT_NODE || block.tag !== 'block') {
                return false;
            }

            const name = block.attrsList.find(attr => attr.name === 'name');
            if (!name || !name.value) {
                return console.warn('block need name attribute');
            }

            trimChildren(block.firstChild, 1);
            trimChildren(block.lastChild, 2);
            blocks[name.value] = block;
        });

        element.parent._children = [element];
        element.blocks = blocks;
    },

    async compile(element, children, env, template, sub) {
        const name = element.attrsList.find(attr => attr.name === 'name');
        const nodeType = element.constructor.nodeType;

        if (!name || !name.value) {
            return console.warn('extend need name attribute');
        }

        if (element.parent.nodeType !== nodeType.DOCUMENT_NODE) {
            return console.warn('extend must use in document root');
        }

        // 解析父级
        const tmpl = await env.getTemplate(name.value, false, {name: template.name, blocks: element.blocks, sub});
        await tmpl.compile();
        return tmpl.props.code;
    }
};

exports.block = {
    async compile(element, children, env, template, sub = {}) {
        const name = element.attrsList.find(attr => attr.name === 'name');
        if (!name) {
            return console.warn('block need name attribute');
        }

        let slot = children;

        const compileBlock = async function compileBlock(level) {
            if (level.blocks && level.blocks[name.value]) {
                const block = level.blocks[name.value];
                slot = await block.compileChildren(env, template, {name: template.name, slot});
            }

            if (level.sub) {
                await compileBlock(level.sub);
            }
        };

        await compileBlock(sub);
        return slot;
    }
};

exports.slot = {
    async compile(element, children, env, template, sup = {}) {
        return sup.slot;
    }
};
