var testDocument = require("./test-document")
var testDomElement = require("./test-dom-element")
var testDomComment = require("./test-dom-comment")
var testCtor = require("./test-ctor")
var document = require("../index")

testDocument(document)
testDomElement(document)
testDomComment(document)
testCtor(document)

if (typeof window !== "undefined" && window.document) {
    testDocument(window.document)
    testDomElement(window.document)
    testDomComment(window.document)
    testCtor(document)
}
