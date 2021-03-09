setSearchBar()

const searchButton = document.querySelector('.searchBtn');
searchButton.addEventListener("click", updateSearch);



function updateSearch() {
    // saving input in local storage
    const storage = window.localStorage;
    let search = document.querySelector('.searchField').value;
    storage.setItem('searching', search);
    setSearchBar();

}

// set searchbar with latest search item
function setSearchBar() {
    // checks the local storage and updates the input field with the value
    let storageValue = localStorage.getItem('searching');
    let search = document.querySelector('.searchField');
    search.value = storageValue;

    return storageValue
}