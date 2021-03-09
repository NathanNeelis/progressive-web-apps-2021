// Imports 
const filterSingleObject = require('../utils/transformSingleObject');
const removeGarbage = require('../utils/imageRequired');
const getData = require('../utils/getData');


async function movieDetail(req, res) {
    try {

        // endpoint variables
        const endpoint = 'https://api.themoviedb.org/3'; // base url
        const movie = '/movie/';
        const key = '?api_key=172dbac1b2ced3673820d2a54c969fe1'; // api key
        const id = req.params.id; // ID FROM URL
        let url = endpoint + movie + id + key;

        // getting the data and transforming
        const incomingData = await getData(url); // FETCH THE DATA
        const transformData = filterSingleObject(incomingData); // TRANSFORM OBJECT TO OBJECT WITH ITEMS I'LL USE
        const data = transformData;

        res.render("detailpage.ejs", {
            data: data,
        });



    } catch (err) {
        res.send('something went wrong in the gathering the data');
    }


}


module.exports = movieDetail;