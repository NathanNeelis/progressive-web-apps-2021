// imports 
const filterObject = require('../utils/transformObject');
const removeGarbage = require('../utils/imageRequired');
const getData = require('../utils/getData');


// if (typeof localStorage === "undefined" || localStorage === null) {
//     var LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('./scratch');
// }


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

    let search = req.body.searchMovieName;

    let searchUrl = endpoint + searching + movie + key + language + adult + preSearch + search;

    // getting the data and transforming
    const incomingData = await getData(searchUrl); // FETCH THE DATA
    const cleanData = removeGarbage(incomingData.results); // REMOVE DATA WITH NO IMAGES
    const transformData = filterObject(cleanData); // TRANSFORM OBJECT TO OBJECT WITH ITEMS I'LL USE
    const data = transformData;


    res.render("search.ejs", {
        data: data,
        searchMovie: search,
        searchItem: search
    });

}

module.exports = search;