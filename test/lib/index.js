const kyber = require('../../');
const viewPath = './test/fixtures/';

exports.render = async function render(str, ctx = {}, options = {}, env = null) {
    env = env || kyber.configure(viewPath, options);
    return await env.renderString(str, ctx);
};

exports.renderFile = async function renderFile(name, ctx = {}, options = {}, env = null) {
    env = env || kyber.configure(viewPath, options);
    return await env.render(name, ctx);
};

exports.kyber = kyber;
exports.viewPath = viewPath;
