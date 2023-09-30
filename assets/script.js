var searchBarEl = document.querySelector("#searchBar");
var searchHistoryEl = document.querySelector("#searchHistory");

searchBarEl.addEventListener("submit", function(event) {
    event.preventDefault();

    var citySearch = event.target.citySearch.value;

    document.getElementById("currentInfo").innerHTML = "";
    document.getElementById("moreInfo").innerHTML = "";
    document.getElementById("fiveDay").innerHTML = "";
    document.getElementById("searchHistory").innerHTML = "";
    document.getElementById("cityName").innerHTML = "";

    getCoordinates(citySearch);
    saveSearch(citySearch)
});

searchHistoryEl.addEventListener("click", function(event){
    var test = event.target;

    if (test.matches(".searchBtn")) {

        document.getElementById("currentInfo").innerHTML = "";
        document.getElementById("moreInfo").innerHTML = "";
        document.getElementById("fiveDay").innerHTML = "";
        document.getElementById("cityName").innerHTML = "";

        getCoordinates(test.value);

    } else if (test.matches("#clearBtn")) {

        var searchHistory = [];
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        document.getElementById("searchHistory").innerHTML = "";
    };
});

function init() {
    displayHistory();
    getCoordinates('Los Angeles');
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

    var clearBtn = document.createElement("button");
    clearBtn.innerHTML = "Clear";
    clearBtn.setAttribute("id", "clearBtn");
    clearBtn.classList.add("clear");
    $("#searchHistory").append(clearBtn);

};

function getCoordinates(city) {
    var URL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {
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
        var wind = Math.round((data.wind.speed * 2.23694) * 10) / 10;
        var humidity = data.main.humidity;
        var format = dayjs().format('MMM D, YYYY');


        var feelsText = document.createElement("div");
        var tempMaxMinText = document.createElement("div");
        var windText = document.createElement("div");
        var humidityText = document.createElement("div");
        var dateText = document.createElement("div");
        var mainTemp = document.createElement("div");
        var space = document.createElement("br");


        mainTemp.classList.add("tempColor");
        mainTemp.innerHTML = Math.trunc((temp - 273.15) * (9/5) + 32) + "°F  /  " + description;
        mainTemp.classList.add("bigger");
        dateText.innerHTML = format;
        feelsText.innerHTML = "Feels like " + Math.trunc((feels - 273.15) * (9/5) + 32) + "°F";
        tempMaxMinText.innerHTML = "High " + Math.trunc((tempMax - 273.15) * (9/5) + 32) + "°F  /  Low " + Math.trunc((tempMin - 273.15) * (9/5) + 32) + "°F";
        windText.innerHTML = "Wind: " + wind + " mph";
        humidityText.innerHTML = "Humidity: " + humidity + "%";

        $("#cityName").append(name);
        $("#currentInfo").append(dateText, space);
        $("#currentInfo").append('<img src="" id="icon" alt="Weather Icon">');
        $("#currentInfo").append(mainTemp, space);
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

        var displayLength = 37;
        for (i = 4; i < displayLength; i+=8) {

            var date = dayjs(data.list[i].dt_txt);
            var formatted = date.format('MMM D, YYYY');
            var temp = data.list[i].main.temp;
            var wind = Math.round((data.list[i].wind.speed * 2.23694) * 10) / 10;
            var humidity = data.list[i].main.humidity;
            var description = data.list[i].weather[0].main;

            var tempText = document.createElement("div");
            var iconText = document.createElement("img");
            var windText = document.createElement("div");
            var humidityText = document.createElement("div");
            var dateText = document.createElement("div");
            var space = document.createElement("br");
            var day = document.createElement("div");

            var iconURL = 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png';
            iconText.setAttribute("src", iconURL);

            tempText.classList.add("tempColor");
            tempText.innerHTML = Math.trunc((temp - 273.15) * (9/5) + 32) + "°F  /  " + description;
            windText.innerHTML = "Wind: " + wind + " mph";
            humidityText.innerHTML = "Humidity: " + humidity + "%";
            dateText.innerHTML = formatted;

            day.classList.add("marginRight");
            day.append(dateText, iconText, tempText, windText, humidityText, space);

            $("#fiveDay").append(day);
        };
    })
};

init();