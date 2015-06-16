function sibling(node, offset) {
    var parent = node.parentNode

    if (parent) {
        return parent.childNodes[parent.childNodes.indexOf(node) + offset] || null
    }

    return null
}

exports.next = function nextSibling() {
    return sibling(this, 1)
}

exports.previous = function previousSibling() {
    return sibling(this, -1)
}
