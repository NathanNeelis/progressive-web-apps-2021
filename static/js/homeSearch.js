const searchButtonIntro = document.querySelector('.searchBtnIntro');
searchButtonIntro.addEventListener("click", updateSearchIntro);

function updateSearchIntro() {
    // saving input in local storage
    const storage = window.localStorage;
    let search = document.querySelector('.searchFieldIntro').value;
    storage.setItem('searching', search);
}