module.exports = serializeNode

var voidElements = /area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr/i;

function serializeNode(node) {
    switch (node.nodeType) {
        case 3:
            return escapeText(node.data)
        case 8:
            return "<!--" + node.data + "-->"
        default:
            return serializeElement(node)
    }
}

function serializeElement(elem) {
    var strings = []

    var tagname = elem.tagName

    if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
        tagname = tagname.toLowerCase()
    }

    strings.push("<" + tagname + properties(elem) + datasetify(elem))

    if (voidElements.test(tagname)) {
        strings.push(" />")
    } else {
        strings.push(">")

        if (elem.childNodes.length) {
            strings.push.apply(strings, elem.childNodes.map(serializeNode))
        }

        strings.push("</" + tagname + ">")
    }

    return strings.join("")
}

function isProperty(elem, key) {
    var type = typeof elem[key]

    if (key === "style" && Object.keys(elem.style).length > 0) {
      return true
    }

    return elem.hasOwnProperty(key) &&
        (type === "string" || type === "boolean" || type === "number") &&
        key !== "nodeName" && key !== "className" && key !== "tagName" &&
        key !== "textContent" && key !== "innerText" && key !== "namespaceURI"
}

function stylify(styles) {
    var attr = ""
    Object.keys(styles).forEach(function (key) {
        var value = styles[key]
        attr += key + ":" + value + ";"
    })
    return attr
}

function datasetify(elem) {
    var ds = elem.dataset
    var props = []

    for (var key in ds) {
        props.push({ name: "data-" + key, value: ds[key] })
    }

    return props.length ? stringify(props) : ""
}

function stringify(list) {
    var attributes = []
    list.forEach(function (tuple) {
        var name = tuple.name
        var value = tuple.value

        if (name === "style") {
            value = stylify(value)
        }

        attributes.push(name + "=" + "\"" + escapeAttributeValue(value) + "\"")
    })

    return attributes.length ? " " + attributes.join(" ") : ""
}

function properties(elem) {
    var props = []
    for (var key in elem) {
        if (isProperty(elem, key)) {
            props.push({ name: key, value: elem[key] })
        }
    }

    for (var ns in elem._attributes) {
      for (var attribute in elem._attributes[ns]) {
        var name = (ns !== "null" ? ns + ":" : "") + attribute
        props.push({ name: name, value: elem._attributes[ns][attribute] })
      }
    }

    if (elem.className) {
        props.push({ name: "class", value: elem.className })
    }

    return props.length ? stringify(props) : ""
}

function escapeText(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}

function escapeAttributeValue(str) {
    return escapeText(str).replace(/"/g, "&quot;")
}
