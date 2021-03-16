// imports 
const getData = require('../utils/getData');


//search page
async function search(req, res) {
    const endpoint = 'https://api.themoviedb.org/3'; // base url

    // endpoint variables
    const searching = '/search';
    const movie = '/movie?';
    const key = 'api_key=172dbac1b2ced3673820d2a54c969fe1'; // api key
    const language = '&language=en-US'; // language
    const adult = '&include_adult=false';
    const preSearch = '&query=';

    let search = req.params.id;
    let searchUrl = endpoint + searching + movie + key + language + adult + preSearch + search;


    const data = await getData(searchUrl); // FETCH THE DATA


    res.render("searchDetailpage.ejs", {
        data: data,
        searchMovie: search
    });
}

module.exports = search;