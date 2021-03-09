// nodemon: npm start - to start the application link: localhost:4000

const express = require('express');
const bodyParser = require("body-parser"); // load body parser for http requests
const app = express();
const port = 4000;

// imports

// import routes
const home = require('./routes/home');
const search = require('./routes/search');
const searchDetail = require('./routes/searchDetail');
const searchRedirect = require('./routes/searchRedirect');
const movies = require('./routes/movies');
const movieDetail = require('./routes/movieDetail');
const notFound = require('./routes/404');


app
    .use(express.static(__dirname + "/static")) // this is used to attach the front-end and styling
    .use(
        bodyParser.urlencoded({
            extended: true,
        })
    )


    .set('view engine', 'ejs') // templating engine = ejs
    .set('views', 'views') // find the views in views(route)

    .get("/", home) // Routing
    .get("/search", search) // Routing
    .get('/search/:id', searchDetail) // Routing
    .get("/movies", movies) // Routing
    .get('/movies/:id', movieDetail) // Routing


    .post("/", searchRedirect) // Routing
    .post("/search", searchRedirect) // Routing
    .post('/search/:id', searchRedirect) // Routing

    .use(notFound) // 404 page
    .listen(port, () => {
        console.log(`Server is working at http://localhost:${port}`)
    });