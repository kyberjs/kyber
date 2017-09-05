const test = require('ava');
const utils = require('../lib');

test.serial('if-else directive', async t => {
    let result = '';

    result = await utils.render('<div kyber-if="value">Hello</div>', {value: true});
    t.is(result, '<div>Hello</div>');

    result = await utils.render('<div kyber-if="value">Hello</div>', {value: false});
    t.is(result, '');

    result = await utils.render('<div kyber-else>Else</div>', {value: true});
    t.is(result, '');

    result = await utils.render('<div kyber-if="value">Hello</div><div kyber-else>Else</div>', {value: true});
    t.is(result, '<div>Hello</div>');

    result = await utils.render('<div kyber-if="value">Hello</div><div kyber-else>Else</div>', {value: false});
    t.is(result, '<div>Else</div>');

    result = await utils.render('<div kyber-if="false">Hello</div><div kyber-elseif="value">ElseIf</div>', {value: true});
    t.is(result, '<div>ElseIf</div>');

    result = await utils.render('<div kyber-if="false">Hello</div><div kyber-elseif="value">Else</div>', {value: false});
    t.is(result, '');

    result = await utils.render('<div kyber-elseif="value">Else</div>', {value: false});
    t.is(result, '');
});

test.serial('for directive', async t => {
    let result = '';
    result = await utils.render('<div kyber-for="(item, index) in list"><p>{{index}}. {{ item }}</p></div>', {list: ['first', 'second']});
    t.is(result, '<div><p>0. first</p><p>1. second</p></div>');

    result = await utils.render('<div kyber-for="(value, key, index) in map"><p>{{index}}. {{ key }} {{ value }}</p></div>', {map: {a: 'first', b: 'second'}});
    t.is(result, '<div><p>0. a first</p><p>1. b second</p></div>');

    result = await utils.render('<div kyber-for="value of map"><p>{{ value }}</p></div>', {map: {a: 'first', b: 'second'}});
    t.is(result, '<div><p>first</p><p>second</p></div>');
});

test.serial('default directive', async t => {
    let result = '';
    result = await utils.render('<div kyber-data-value="value">Hello</div>', {value: 'customValue'});
    t.is(result, '<div data-value="customValue">Hello</div>');

    result = await utils.render('<div kyber-value>Hello</div>');
    t.is(result, '<div value>Hello</div>');
});

test.serial('class directive', async t => {
    let result = '';
    result = await utils.render('<div class="main" kyber-class="value">Hello</div>', {value: ['first', 'second']});
    t.is(result, '<div class="main first second">Hello</div>');
});

test.serial('style directive', async t => {
    let result = '';
    result = await utils.render('<p style="font-size: 14px; color: #FFF;" kyber-style="value">Hello</p>', {value: {fontSize: '17px'}});
    t.is(result, '<p style="font-size:17px;color:#FFF;">Hello</p>');
});

test.serial('strip directive', async t => {
    let result = '';
    result = await utils.render('<div kyber-strip> Hello </div>', null, {collapseWhitespace: false});
    t.is(result, '<div>Hello</div>');

    result = await utils.render('<div kyber-strip> <span> Hello </span> </div>', null, {collapseWhitespace: false});
    t.is(result, '<div><span> Hello </span></div>');

    result = await utils.render('<div kyber-strip><span> Hello </span></div>', null, {collapseWhitespace: false});
    t.is(result, '<div><span> Hello </span></div>');
});

test.serial('literal directive', async t => {
    let result = '';
    result = await utils.render('<script kyber-literal>{{ value }}</script>');
    t.is(result, '<script>{{ value }}</script>');

    result = await utils.render('<script kyber-literal><span kyber-if="true">Hello</span></script>');
    t.is(result, '<script><span kyber-if="true">Hello</span></script>');

    result = await utils.render('<div kyber-literal>{{ value }}</div>', {value: 'Hello'});
    t.is(result, '<div>Hello</div>');
});
