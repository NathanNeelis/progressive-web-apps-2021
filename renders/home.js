// Imports 
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


        const data = await getData(url); // FETCH THE DATA


        res.render("home.ejs", {
            data: data,
        });



    } catch (err) {
        res.send('something went wrong in the gathering the data');
    }


}


module.exports = home;