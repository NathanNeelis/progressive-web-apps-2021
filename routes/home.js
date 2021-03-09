// Imports 
const filterObject = require('../utils/transformObject');
const removeGarbage = require('../utils/imageRequired');
const getData = require('../utils/getData');


async function home(req, res) {
    try {

        // endpoint variables
        const endpoint = 'https://api.themoviedb.org/3'; // base url
        const discover = '/discover';
        const movie = '/movie?';
        const key = 'api_key=172dbac1b2ced3673820d2a54c969fe1'; // api key
        const language = '&language=en-US'; // language
        const sort = '&sort_by=popularity.desc'; // sort by popularity
        const page = '&page=1'; // page 1/500

        let url = '';
        url = endpoint + discover + movie + key + language + sort + page;

        // getting the data and transforming
        const incomingData = await getData(url); // FETCH THE DATA
        const cleanData = removeGarbage(incomingData.results); // REMOVE DATA WITH NO IMAGES
        const transformData = filterObject(cleanData); // TRANSFORM OBJECT TO OBJECT WITH ITEMS I'LL USE
        const data = transformData;

        res.render("home.ejs", {
            data: data,
        });



    } catch (err) {
        res.send('something went wrong in the gathering the data');
    }


}


module.exports = home;