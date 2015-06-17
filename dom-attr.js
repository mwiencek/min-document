function Attr() {
    this.name = ""
    this.value = null
}

Object.defineProperty(Attr.prototype, "isId", {
    get: function () { return this.name === "id" }
})

module.exports = Attr
