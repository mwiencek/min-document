var Node = require("./dom-node.js");

module.exports = DocumentFragment

function DocumentFragment(owner) {
    if (!(this instanceof DocumentFragment)) {
        return new DocumentFragment()
    }

    this.childNodes = []
    this.parentNode = null
    this.ownerDocument = owner || null
}

DocumentFragment.prototype = new Node()
DocumentFragment.prototype.type = "DocumentFragment"
DocumentFragment.prototype.nodeType = 11
DocumentFragment.prototype.nodeName = "#document-fragment"

DocumentFragment.prototype.toString =
    function _DocumentFragment_toString() {
        return this.childNodes.map(function (node) {
            return String(node)
        }).join("")
    }
