var searchBar = document.querySelector("#searchBar");

searchBar.addEventListener("submit", function(event) {
    event.preventDefault();

    var citySearch = event.target.citySearch.value;
    console.log(citySearch, 'Success');
});

function getCoordinates() {
    var URL = 'http://api.openweathermap.org/geo/1.0/direct?q=' +  + '&limit=5&appid=885e7a2453d9981f57f30a861b8634ec'
};

function searchCity() {
    var URL = ''
};