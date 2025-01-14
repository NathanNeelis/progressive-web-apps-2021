function filterObject(results) {
    let items = results.map((results) => {
        return {
            id: results.id,
            title: results.title,
            overview: results.overview,
            popularity: results.popularity,
            poster_path: 'https://image.tmdb.org/t/p/w200' + results.poster_path,
            release_date: results.release_date,
            vote_average: results.vote_average,
            vote_count: results.vote_count
        }
    });

    return items
}


module.exports = filterObject;