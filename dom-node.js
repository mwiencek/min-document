var extend = require("xtend")
var isPlainObject = require('is-plain-object')
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


Node.prototype.cloneNode = function cloneNode(deep) {
    var clone = new this.constructor()

    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            var value = this[key];

            if (isPlainObject(value)) {
                clone[key] = extend(value)
            } else {
                clone[key] = value
            }
        }
    }

    if (this.childNodes) {
        clone.childNodes = deep ? this.childNodes.map(function(child) { return child.cloneNode(true) }) : []
    }

    return clone
}

Object.defineProperty(Node.prototype, "firstChild", {
    get: function () {
        return this.childNodes[0] || null
    }
})

Object.defineProperty(Node.prototype, "lastChild", {
    get: function () {
        return this.childNodes[this.childNodes.length - 1] || null
    }
})

function getSibling(node, offset) {
    var parent = node.parentNode

    if (parent) {
        return parent.childNodes[parent.childNodes.indexOf(node) + offset] || null
    }

    return null
}

Object.defineProperty(Node.prototype, "nextSibling", {
    get: function () {
        return getSibling(this, 1)
    }
})

Object.defineProperty(Node.prototype, "previousSibling", {
    get: function () {
        return getSibling(this, -1)
    }
})

Node.prototype.dispatchEvent = require("./event/dispatch-event.js")
Node.prototype.addEventListener = require("./event/add-event-listener.js")
Node.prototype.removeEventListener = require("./event/remove-event-listener.js")
