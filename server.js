// nodemon: npm start - to start the application link: localhost:4000

const express = require('express');
const bodyParser = require("body-parser"); // load body parser for http requests
const compression = require('compression');
const app = express();
const port = process.env.PORT || 4000

// import helper functions
const shouldCompress = require('./utils/compress');

// import routes
const home = require('./renders/home');
const search = require('./renders/search');
const searchDetail = require('./renders/searchDetail');
const searchRedirect = require('./renders/searchRedirect');
const movies = require('./renders/movies');
const movieDetail = require('./renders/movieDetail');
const notFound = require('./renders/404');
const offline = require('./renders/offline');

app
    .use(express.static(__dirname + "/static")) // this is used to attach the front-end and styling
    .use(
        bodyParser.urlencoded({
            extended: true,
        })
    )
    .use(compression({
        threshold: 0, // compress everyfile that is more then 0 bytes
        filter: shouldCompress, // dont compress if header is x-no-compression
    }))


    .set('view engine', 'ejs') // templating engine = ejs
    .set('views', 'views') // find the views in views(route)

    // Routing
    .get("/", home)
    .get("/search", search)
    .get('/search/:id', searchDetail)
    .get("/movies", movies)
    .get('/movie/:id', movieDetail)
    .get('/offline', offline)
    .get('/testcomp', (req, res) => {
        const payload = "this is a testing string if the app gets faster..."
        res.send(payload.repeat(10000))
    }) // Testing compression

    // post data to server
    .post("/", searchRedirect)
    .post("/search", searchRedirect)
    .post('/search/:id', searchRedirect)

    .use(notFound) // 404 page
    .listen(port, () => {
        console.log(`Server is working at http://localhost:${port}`)
    });