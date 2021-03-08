const fetch = require('node-fetch');
const filterObject = require('../utils/transformObject');
const removeGarbage = require('../utils/imageRequired');

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

    let search = req.body.searchMovieName
    let searchUrl = endpoint + searching + movie + key + language + adult + preSearch + search;

    const fetchResponse = await fetch(searchUrl);
    const json = await fetchResponse.json();
    const cleanData = removeGarbage(json.results);
    const transformData = filterObject(cleanData);
    const data = transformData;

    res.render("search.ejs", {
        data: data,
        searchMovie: search
    });
}

module.exports = search;