const Base = require('./base');

const Comment = class Comment extends Base {
    constructor(comment, parent) {
        super(Base.COMMENT_NODE, parent);
        this.comment = comment;
    }

    compile() {
        return JSON.stringify(`<!--${this.comment}-->`);
    }

    toString() {
        return `<!--${this.comment}-->`;
    }
};

module.exports = Comment;
