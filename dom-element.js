var domWalk = require("dom-walk")
var parse5 = require("parse5")
var Node = require("./dom-node.js")
var serializeNode = require("./serialize.js")

var htmlns = "http://www.w3.org/1999/xhtml"

module.exports = DOMElement

function DOMElement(tagName, owner, namespace) {
    if (!(this instanceof DOMElement)) {
        return new DOMElement(tagName)
    }

    var ns = namespace === undefined ? htmlns : (namespace || null)

    this.tagName = ns === htmlns ? String(tagName).toUpperCase() : tagName
    this.className = ""
    this.dataset = {}
    this.childNodes = []
    this.parentNode = null
    this.style = {}
    this.ownerDocument = owner || null
    this.namespaceURI = ns
    this._attributes = {}

    if (this.tagName === 'INPUT') {
        this.type = 'text'
    }
}

DOMElement.prototype = new Node()
DOMElement.prototype.constructor = DOMElement
DOMElement.prototype.type = "DOMElement"
DOMElement.prototype.nodeType = 1

DOMElement.prototype.setAttributeNS =
    function _Element_setAttributeNS(namespace, name, value) {
        var colonPosition = name.indexOf(":")
        var localName = colonPosition > -1 ? name.substr(colonPosition + 1) : name
        var attributes = this._attributes[namespace] || (this._attributes[namespace] = {})
        attributes[localName] = value
    }

DOMElement.prototype.getAttributeNS =
    function _Element_getAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        if (!(attributes && typeof attributes[name] === "string")) {
            return null
        }

        return attributes[name]
    }

DOMElement.prototype.removeAttributeNS =
    function _Element_removeAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        if (attributes) {
            delete attributes[name]
        }
    }

DOMElement.prototype.setAttribute = function _Element_setAttribute(name, value) {
    return this.setAttributeNS(null, name, value)
}

DOMElement.prototype.getAttribute = function _Element_getAttribute(name) {
    return this.getAttributeNS(null, name)
}

DOMElement.prototype.removeAttribute = function _Element_removeAttribute(name) {
    return this.removeAttributeNS(null, name)
}

// Un-implemented
DOMElement.prototype.focus = function _Element_focus() {
    return void 0
}

DOMElement.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
    var classes = classNames.split(" ");
    var elems = []

    domWalk(this, function (node) {
        if (node.nodeType === 1) {
            var nodeClassName = node.className || ""
            var nodeClasses = nodeClassName.split(" ")

            if (classes.every(function (item) {
                return nodeClasses.indexOf(item) !== -1
            })) {
                elems.push(node)
            }
        }
    })

    return elems
}

DOMElement.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
    tagName = tagName.toLowerCase()
    var elems = []

    domWalk(this.childNodes, function (node) {
        if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
            elems.push(node)
        }
    })

    return elems
}

Object.defineProperty(DOMElement.prototype, "innerHTML", {
    get: function () {
        return this.childNodes.map(serializeNode).join("")
    },
    set: function (html) {
        var parser = new parse5.Parser()
        var fragment = parser.parseFragment(html)
        var doc = this.ownerDocument

        this.childNodes = fragment.childNodes.map(function(src) {
            return getParsedNode(doc, src)
        })
    }
})

Object.defineProperty(DOMElement.prototype, "outerHTML", {
    get: function () {
        return this.toString()
    }
})

function getParsedNode(doc, src) {
    var node
    switch (src.nodeName) {
        case "#text":
            node = doc.createTextNode(src.value)
            break
        case "#comment":
            node = doc.createComment(src.data)
            break
        default:
            node = doc.createElement(src.nodeName)

            node.childNodes = src.childNodes.map(function(n) {
                return getParsedNode(doc, n)
            })

            src.attrs.forEach(function(attr) {
                node.setAttribute(attr.name, attr.value)
            })
    }
    return node
}
