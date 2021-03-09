// nodemon: npm start - to start the application link: localhost:4000

const express = require('express');
const bodyParser = require("body-parser"); // load body parser for http requests
const app = express();
const port = 4000;

// imports

// import routes
const home = require('./routes/home');
const search = require('./routes/search')
const notFound = require('./routes/404')


app
    .use(express.static(__dirname + "/static")) // this is used to attach the front-end and styling
    .use(
        bodyParser.urlencoded({
            extended: true,
        })
    )
    .set('view engine', 'ejs')
    .set('views', 'views')
    .get("/", home) // Routing
    .post("/", home) // Routing
    .get("/search", search) // Routing
    .post("/search", search) // Routing
    .use(notFound)
    .listen(port, () => {
        console.log(`Server is working at http://localhost:${port}`)
    });