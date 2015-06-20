module.exports = function getElementById(id) {
    if (String(this.id) === String(id)) {
        return this
    }

    var arr = this.childNodes
    var result = null

    if (!arr) {
        return result
    }

    for (var i = 0, len = arr.length; !result && i < len; i++) {
        result = arr[i].getElementById(id)
    }

    return result
}
