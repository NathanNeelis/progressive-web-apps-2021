function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}

module.exports = shouldCompress;


// compression
// resource https://medium.com/@victor.valencia.rico/gzip-compression-with-node-js-cc3ed74196f9
// resource 2 https://www.youtube.com/watch?v=jZ6x5Ab7Bgc