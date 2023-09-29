var searchBar = document.querySelector("#searchBar");
var searchHist = document.querySelector("#searchHistory");

searchBar.addEventListener("submit", function(event) {
    event.preventDefault();

    var citySearch = event.target.citySearch.value;

    document.getElementById("currentInfo").innerHTML = "";
    document.getElementById("moreInfo").innerHTML = "";
    document.getElementById("fiveDay").innerHTML = "";
    document.getElementById("searchHistory").innerHTML = "";

    getCoordinates(citySearch);
    saveSearch(citySearch)
});

// Need event listener for recent search history buttons
// On click, run getCoordinates with search history value instead of citySearch

searchHist.addEventListener("click", function(event){
    var test = event.target;

    if (test.matches(".searchBtn")) {
        console.log(test.value);

        document.getElementById("currentInfo").innerHTML = "";
        document.getElementById("moreInfo").innerHTML = "";
        document.getElementById("fiveDay").innerHTML = "";

        getCoordinates(test.value);
    };
});

// document.querySelectorAll('button').forEach(button => {
//     button.addEventListener('click', () => {
//         var testBtn = button.value;

//         console.log("Clicked");
//         console.log(testBtn);

        // document.getElementById("currentInfo").innerHTML = "";
        // document.getElementById("moreInfo").innerHTML = "";
        // document.getElementById("fiveDay").innerHTML = "";

        // getCoordinates(historyCity);
//     });
// });

function init() {
    displayHistory();
}

function saveSearch(citySearch) {

    if (citySearch) {
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

        searchHistory.push(citySearch);

        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        displayHistory();
    }
};

function displayHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    for (i = 0; i < searchHistory.length; i++) {
        var searchBtn = document.createElement("button");

        searchBtn.innerHTML = searchHistory[i];

        searchBtn.setAttribute("value", searchHistory[i]);

        searchBtn.classList.add("searchBtn");

        $("#searchHistory").append(searchBtn);
    };
};

function getCoordinates(city) {
    var URL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {
        console.log(data, data[0].lat, data[0].lon);
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        searchCity(latitude, longitude);
        fiveDayForecast(latitude, longitude);
    })
};

function searchCity(latitude, longitude) {
    var URL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {

        var name = data.name;
        var description = data.weather[0].main;
        var temp = data.main.temp;
        var feels = data.main.feels_like;
        var tempMax = data.main.temp_max;
        var tempMin = data.main.temp_min;
        var wind = data.wind.speed;
        var humidity = data.main.humidity;

        var feelsText = document.createElement("div");
        var tempMaxMinText = document.createElement("div");
        var windText = document.createElement("div");
        var humidityText = document.createElement("div");
        var mainTemp = document.createElement("div");
        var space = document.createElement("br");
        var line = document.createElement("hr");

        // Display lines between each
        mainTemp.innerHTML = Math.trunc((temp - 273.15) * (9/5) + 32) + "°F  /  " + description;
        feelsText.innerHTML = "Feels like " + Math.trunc((feels - 273.15) * (9/5) + 32) + "°F";
        tempMaxMinText.innerHTML = "Max " + Math.trunc((tempMax - 273.15) * (9/5) + 32) + "°F / Min " + Math.trunc((tempMin - 273.15) * (9/5) + 32) + "°F";
        windText.innerHTML = "Wind: " + wind + " mph";
        humidityText.innerHTML = "Humidity: " + humidity + "%";

        var format = dayjs().format('MMM D, YYYY');

        $("#currentInfo").append(name, space);
        $("#currentInfo").append(format);
        $("#currentInfo").append('<img src="" id="icon" alt="Weather Icon">');
        $("#currentInfo").append(mainTemp);
        $("#moreInfo").append(feelsText, tempMaxMinText, windText, humidityText);

        var iconURL = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        document.getElementById("icon").setAttribute("src", iconURL);
    })
};

function fiveDayForecast(latitude, longitude) {
    var URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {

        var today = dayjs();

        var displayLength = 6
        for (i = 1; i < displayLength; i++) {
            var date = today.add(i, 'day');
            var formatted = date.format('MMM D, YYYY');
            var temp = data.list[i].main.temp;
            var wind = data.list[i].wind.speed;
            var humidity = data.list[i].main.humidity;
            var description = data.list[i].weather[0].main;

            var tempText = document.createElement("div");
            var iconText = document.createElement("img");
            var windText = document.createElement("div");
            var humidityText = document.createElement("div");
            var dateText = document.createElement("div");
            var space = document.createElement("br");

            var iconURL = 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png';
            iconText.setAttribute("src", iconURL);

            tempText.innerHTML = Math.trunc((temp - 273.15) * (9/5) + 32) + "°F  /  " + description;
            windText.innerHTML = "Wind: " + wind + " mph";
            humidityText.innerHTML = "Humidity: " + humidity + "%";
            dateText.innerHTML = formatted;

            var oneDay = document.createElement("div");

            oneDay.append(dateText, iconText, tempText, windText, humidityText, space);

            $("#fiveDay").append(oneDay);
        };
    })
};

init();