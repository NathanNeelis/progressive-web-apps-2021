function removeGarbage(data) {
    let items = data.filter(function (items) {
        return items.poster_path != undefined;
    })
    return items
}

module.exports = removeGarbage;