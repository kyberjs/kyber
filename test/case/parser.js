const test = require('ava');
const utils = require('../lib');

test.serial('doctype tag', async t => {
    let result = '';
    const shortDocType = '<!doctype HTML>';
    const h4tDocType = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';

    result = await utils.render(shortDocType);
    t.is(result, shortDocType);

    result = await utils.render(shortDocType + shortDocType);
    t.is(result, shortDocType);

    result = await utils.render(h4tDocType);
    t.is(result, shortDocType);

    result = await utils.render(h4tDocType, {}, {useShortDoctype: false});
    t.is(result, h4tDocType);
});

test.serial('comment', async t => {
    let result = '';
    result = await utils.render('<!-- comment -->', null, {removeComments: false});
    t.is(result, '<!-- comment -->');

    result = await utils.render('<!-- // comment -->', null, {removeComments: false});
    t.is(result, '');
});

test.serial('comment', async t => {
    let result = '';
    result = await utils.render('<!-- comment -->', null, {removeComments: false});
    t.is(result, '<!-- comment -->');

    result = await utils.render('<!-- // comment -->', null, {removeComments: false});
    t.is(result, '');
});
