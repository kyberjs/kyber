const utils = require('../utils');

module.exports = {
    plain: true,
    unary: true,
    transform(element, env) {
        element.attrsList.forEach(item => {
            const name = utils.camelcase(item.name);
            if (!item.expression) {
                env.addGlobal(name, item.value);
            }
        });
    },

    async compile() {
        return null;
    }
};
