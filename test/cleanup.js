module.exports = Cleanup

function Cleanup (document) {

    return cleanup

    function cleanup () {
        var childNodes = document.body.childNodes
        while (childNodes.length) {
            document.body.removeChild(childNodes[0])
        }
    }
}
