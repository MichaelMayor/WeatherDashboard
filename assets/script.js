$(document).ready(function () {
    // Rcover local storage and build search history table with it
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHistory !== null) {
        buildTable(searchHistory);
        search(searchHistory[0]);
    } else {
        searchHistory = [];
        search("London");
    }
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});
    // Write weather data to page
    function updatePage(WeatherData) {
        // Today's weather
        var date = new Date(WeatherData.current.dt * 1000);
        var dateStr = (date.getMonth() + 1).toString() + "/" + date.getDate() + "/" + date.getFullYear();
        $("#date").text(dateStr);
        $("#todayIcon").attr("src", "https://openweathermap.org/img/wn/" + WeatherData.current.weather[0].icon + "@2x.png");
        $("#todayTemp").text(WeatherData.current.temp);
        $("#todayHumidity").text(WeatherData.current.humidity);
        $("#todayWindspeed").text(WeatherData.current.wind_speed);
        $("#todayUV").text(WeatherData.current.uvi);
        if (WeatherData.current.uvi > 7) {
            $("#todayUV").addClass("tag is-danger");
        } else if (WeatherData.current.uvi > 2) {
            $("#todayUV").addClass("tag is-warning");
        } else {
            $("#todayUV").addClass("tag is-success");
        }
        // 5-day forecast
        for (var i = 0; i < 5; i++) {
            date = new Date(WeatherData.daily[i + 1].dt * 1000);
            dateStr = (date.getMonth() + 1).toString() + "/" + date.getDate() + "/" + date.getFullYear();
            $("#day" + i + "Date").text(dateStr);
            $("#day" + i + "Icon").attr("src", "https://openweathermap.org/img/wn/" + WeatherData.daily[i + 1].weather[0].icon + "@2x.png");
            $("#day" + i + "Temp").text(WeatherData.daily[i + 1].temp.max);
            $("#day" + i + "Humidity").text(WeatherData.daily[i + 1].humidity);
        }

    }

    //Adds last searched city to search history
    function updateHistory(WeatherData) {
        searchHistory.unshift(WeatherData.name);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        buildTable(searchHistory);
    }

    //Creates the Search History table
    function buildTable(searchHistory) {
        $("td").detach();
        if (searchHistory.length > 10) {
            searchHistory.length = 10;
        }
        for (var i = 0; i < searchHistory.length; i++) {
            var currentSearch = searchHistory[i];
            if (currentSearch !== null) {
                var row = document.createElement("tr");
                row.id = "tableRow" + i;
                var cell = document.createElement("td");

                cell.textContent = currentSearch;

                $("#tableBody").append(row);
                $("#tableRow" + i).append(cell);
            }
        }
    }

    // Runs search on button click
    $("#search-button").click(function () {
        var cityName = $("#searchbar")
            .val()
            .trim();
        search(cityName);
    });

    // Runs the weather search for a given city name
    function search(cityName) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

        var queryParams = {
            "appid": "7e254ff99ca72e0b2e785026f47b52f0"
        };

        queryParams.q = cityName;
        queryURL = queryURL + $.param(queryParams);

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            updateHistory(response);
            $("#cityName").text(response.name);
            var latlonURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&exclude=minutely,hourly&units=imperial&appid=7e254ff99ca72e0b2e785026f47b52f0";
            console.log(latlonURL);
            $.ajax({
                url: latlonURL,
                method: "GET",
            }).then(updatePage);
        });
    }

    //Triggers the search when clicking the history table
    $("#tableBody").click(function (event) {
        if (event.target.matches("td")) {
            search(event.target.textContent);
        }
    });



});
