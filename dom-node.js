var serializeNode = require("./serialize.js")

module.exports = Node

function Node() {
}

Node.prototype.toString = function toString() {
    return serializeNode(this)
}

Node.prototype.appendChild = function appendChild(child) {
    if (child.parentNode) {
        child.parentNode.removeChild(child)
    }

    this.childNodes.push(child)
    child.parentNode = this

    return child
}

Node.prototype.replaceChild = function replaceChild(elem, needle) {
    // TODO: Throw NotFoundError if needle.parentNode !== this

    if (elem.parentNode) {
        elem.parentNode.removeChild(elem)
    }

    var index = this.childNodes.indexOf(needle)

    needle.parentNode = null
    this.childNodes[index] = elem
    elem.parentNode = this

    return needle
}

Node.prototype.removeChild = function removeChild(elem) {
    // TODO: Throw NotFoundError if elem.parentNode !== this

    var index = this.childNodes.indexOf(elem)
    this.childNodes.splice(index, 1)

    elem.parentNode = null
    return elem
}

Node.prototype.insertBefore = function insertBefore(elem, needle) {
    // TODO: Throw NotFoundError if referenceElement is a dom node
    // and parentNode !== this

    if (elem.parentNode) {
        elem.parentNode.removeChild(elem)
    }

    var index = needle === null || needle === undefined ?
        -1 :
        this.childNodes.indexOf(needle)

    if (index > -1) {
        this.childNodes.splice(index, 0, elem)
    } else {
        this.childNodes.push(elem)
    }

    elem.parentNode = this
    return elem
}

Node.prototype.dispatchEvent = require("./event/dispatch-event.js")
Node.prototype.addEventListener = require("./event/add-event-listener.js")
Node.prototype.removeEventListener = require("./event/remove-event-listener.js")
