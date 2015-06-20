var domWalk = require("dom-walk")

var Node = require("./dom-node.js")
var Comment = require("./dom-comment.js")
var DOMText = require("./dom-text.js")
var DOMElement = require("./dom-element.js")
var DocumentFragment = require("./dom-fragment.js")
var Event = require("./event.js")

module.exports = Document;

function Document() {
    if (!(this instanceof Document)) {
        return new Document();
    }

    this.head = this.createElement("head")
    this.body = this.createElement("body")
    this.documentElement = this.createElement("html")
    this.documentElement.appendChild(this.head)
    this.documentElement.appendChild(this.body)
    this.childNodes = [this.documentElement]
}

var proto = new Node()
Document.prototype = proto

proto.nodeType = 9

proto.createTextNode = function createTextNode(value) {
    return new DOMText(value, this)
}

proto.createElementNS = function createElementNS(namespace, tagName) {
    var ns = namespace === null ? null : String(namespace)
    return new DOMElement(tagName, this, ns)
}

proto.createElement = function createElement(tagName) {
    return new DOMElement(tagName, this)
}

proto.createDocumentFragment = function createDocumentFragment() {
    return new DocumentFragment(this)
}

proto.createEvent = function createEvent(family) {
    return new Event(family)
}

proto.createComment = function createComment(data) {
    return new Comment(data, this)
}

proto.getElementById = function getElementById(id) {
    id = String(id)

    var result = domWalk(this.childNodes, function (node) {
        if (String(node.id) === id) {
            return node
        }
    })

    return result || null
}

proto.getElementsByClassName = DOMElement.prototype.getElementsByClassName
proto.getElementsByTagName = DOMElement.prototype.getElementsByTagName
