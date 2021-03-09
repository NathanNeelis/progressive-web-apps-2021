// imports 
const filterObject = require('../utils/transformObject');
const removeGarbage = require('../utils/imageRequired');
const getData = require('../utils/getData');


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


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
    console.log(search)
    // if search is not undefined, add it to local storage (node side) 
    if (search) {
        localStorage.setItem('searching', search);
    }

    let localStorageData = localStorage.getItem('searching');
    let searchUrl = endpoint + searching + movie + key + language + adult + preSearch + localStorageData;

    // getting the data and transforming
    const incomingData = await getData(searchUrl); // FETCH THE DATA
    const cleanData = removeGarbage(incomingData.results); // REMOVE DATA WITH NO IMAGES
    const transformData = filterObject(cleanData); // TRANSFORM OBJECT TO OBJECT WITH ITEMS I'LL USE
    const data = transformData;


    res.render("searchDetailpage.ejs", {
        data: data,
        searchMovie: search
    });
}

module.exports = search;