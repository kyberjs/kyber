const test = require('ava');
const utils = require('../lib');

test.serial('simple variable', async t => {
    const result = await utils.render('{{ value }}', {value: 'Hello World'});
    t.is(result, 'Hello World');
});


test.serial('variable with filter', async t => {
    const result = await utils.render('{{ value | upper }}', {value: 'Hello World'});
    t.is(result, 'HELLO WORLD');
});

test.serial('variable with function', async t => {
    const result = await utils.render('{{ fn() }}', {fn: () => 'Hello World'});
    t.is(result, 'Hello World');
});
