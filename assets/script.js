var searchBar = document.querySelector("#searchBar");

searchBar.addEventListener("submit", function(event) {
    event.preventDefault();

    var citySearch = event.target.citySearch.value;
    console.log(citySearch, 'Success');

    getCoordinates(citySearch);
});

function getCoordinates(city) {
    var URL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {
        console.log(data, data[0].lat, data[0].lon);
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        searchCity(latitude, longitude);
    })
};

function searchCity(latitude, longitude) {
    var URL = ''
};