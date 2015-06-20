var test = require("tape")

module.exports = testCtor

function testCtor(document) {

    test("Comment", function(assert) {
        var Comment = require("../dom-comment")
        assert.equal(Comment.prototype.constructor, Comment)
        assert.end()
    })

    test("DocumentFragment", function(assert) {
        var DocumentFragment = require("../dom-fragment")
        assert.equal(DocumentFragment.prototype.constructor, DocumentFragment)
        assert.end()
    })

    test("Element", function(assert) {
        var Element = require("../dom-element")
        assert.equal(Element.prototype.constructor, Element)
        assert.end()
    })

    test("Text", function(assert) {
        var Text = require("../dom-text")
        assert.equal(Text.prototype.constructor, Text)
        assert.end()
    })
}
