const fetch = require('node-fetch');

// Imports 
const filterObject = require('../utils/transformObject');
const removeGarbage = require('../utils/imageRequired');
const filterSingleObject = require('../utils/transformSingleObject');


async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    let newData = '';

    if (data.results !== undefined) {
        // getting the data and transforming
        const cleanData = removeGarbage(data.results); // REMOVE DATA WITH NO IMAGES
        const transformData = filterObject(cleanData); // TRANSFORM OBJECT TO OBJECT WITH ITEMS I'LL USE
        newData = transformData;

    } else if (data.results === undefined) {
        const transformData = filterSingleObject(data); // TRANSFORM OBJECT TO OBJECT WITH ITEMS I'LL USE
        newData = transformData;
    }



    return newData;
}

module.exports = getData;