const Base = require('./base');
const Element = require('./element');
const Doctype = require('./doctype');
const Document = require('./document');
const Text = require('./text');
const Comment = require('./comment');

module.exports = {
    Element,
    Doctype,
    Document,
    Text,
    Comment,
    nodeType: Base.nodeType
};
