// Imports 
const getData = require('../utils/getData');


async function movieDetail(req, res) {
    try {

        // endpoint variables
        const endpoint = 'https://api.themoviedb.org/3'; // base url
        const movie = '/movie/';
        const key = '?api_key=172dbac1b2ced3673820d2a54c969fe1'; // api key
        const id = req.params.id; // ID FROM URL
        let url = endpoint + movie + id + key;

        const data = await getData(url); // FETCH THE DATA

        res.render("detailpage.ejs", {
            data: data,
        });



    } catch (err) {
        res.send('something went wrong in the gathering the data');
    }


}


module.exports = movieDetail;