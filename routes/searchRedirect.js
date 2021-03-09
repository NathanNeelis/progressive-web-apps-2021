function searchRedirect(req, res) {
    let search = req.body.searchMovieName;

    res.writeHead(302, {
        'Location': '/search/' + search
    });
    res.end();
}

module.exports = searchRedirect;