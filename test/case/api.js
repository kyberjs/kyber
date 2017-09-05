const test = require('ava');
const kyber = require('../lib').kyber;

const viewPath = './test/fixtures/';

test.serial('configure api', async t => {
    kyber.configure(viewPath, {});
    const result = await kyber.renderString('<span></span>');

    t.is(result, '<span></span>');
});

test.serial('compile api', async t => {

    const template = await kyber.compile('compile');

    await template.compile();
    t.is(template.props.code, '"<span"+">"+"</span>"+""');
});

test.serial('getTemplate api', async t => {
    const env = kyber.configure(viewPath, {});

    const template = await env.compile('compile');
    const tmpl = await env.getTemplate(template, true);
    t.is(tmpl.props.code, '"<span"+">"+"</span>"+""');

    const error = env.getTemplate({}, true);
    await t.throws(error, err => {
        return err.message === 'template names must be a string: [object Object]';
    });
});

test.serial('error template path', async t => {
    const env = kyber.configure(viewPath, {});
    await t.throws(env.render('unknown'), err => {
        return err.message === 'template not found: unknown';
    });
});

test.serial('new Environment', async t => {
    const env = new kyber.Environment();

    const result = await env.renderString('<span></span>');
    t.is(result, '<span></span>');
});

test.serial('getGlobal', async t => {
    const env = kyber.configure(viewPath, {});

    env.addGlobal('name', 'value');

    t.throws(() => env.getGlobal('key'), err => {
        return err.message === 'global not found: key';
    });

    t.is(env.getGlobal('name'), 'value');
});
