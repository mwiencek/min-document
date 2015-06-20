var Node = require("./dom-node.js")

module.exports = Comment

function Comment(data, owner) {
    if (!(this instanceof Comment)) {
        return new Comment(data, owner)
    }

    this.data = data
    this.nodeValue = data
    this.length = data.length
    this.ownerDocument = owner || null
}

Comment.prototype = new Node()
Comment.prototype.constructor = Comment
Comment.prototype.nodeType = 8
Comment.prototype.nodeName = "#comment"

Comment.prototype.toString = function _Comment_toString() {
    return "[object Comment]"
}
