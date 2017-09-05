const test = require('ava');
const utils = require('../lib');

test.serial('unary tag', async t => {
    let result = '';

    result = await utils.render('<br>');
    t.is(result, '<br/>');

    result = await utils.render('<img src="image.jpg">');
    t.is(result, '<img src="image.jpg"/>');
});

test.serial('block html tag', async t => {
    let result = '';
    result = await utils.render('<div></div>');
    t.is(result, '<div></div>');

    result = await utils.render('<div> Hello World </div>');
    t.is(result, '<div>Hello World </div>');
});

test.serial('import tag', async t => {
    let result = '';
    result = await utils.renderFile('import');
    t.is(result, '<h1>Hello</h1>');

    result = await utils.renderFile('import-2');
    t.is(result, '<h1>Hello</h1>');

    result = await utils.renderFile('import-3');
    t.is(result, '');

    result = await utils.renderFile('import-4');
    t.is(result, '');
});

test.serial('template tag', async t => {
    let result = '';
    result = await utils.render('<template>Hello</template>');
    t.is(result, 'Hello');
});

test.serial('inherit tag', async t => {
    let result = '';
    result = await utils.renderFile('inherit-page');
    t.is(result, 'Page -Base');
});

test.serial('set tag', async t => {
    let result = '';
    result = await utils.render('<set name="Title"/><div>{{ name }}</div>');
    t.is(result, '<div>Title</div>');
});

test.serial('component tag', async t => {
    utils.kyber.configure(utils.viewPath);
    utils.kyber.component('dialog', 'dialog');

    const result = await utils.kyber.renderString('<dialog title="warning" kyber-content="content"/>', {content: 'some content'});
    t.is(result, '<div class="dialog"><h1>Dialog WARNING</h1><div class="content">some content</div></div>');
});
