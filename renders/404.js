// 404 error -> make a 404 page here
function notFound(req, res) {
    res.status(404).send("404 page to make");
}

module.exports = notFound;