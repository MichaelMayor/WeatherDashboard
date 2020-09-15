$(document).ready(function () {
    function buildQueryURL() {
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?";

        var queryParams = {
            "appid": "7e254ff99ca72e0b2e785026f47b52f0"
        };

        queryParams.q = $("#searchbar")
            .val()
            .trim();


        // Logging the URL so we have access to it for troubleshooting
        console.log("---------------\nURL: " + queryURL + "\n---------------");
        console.log(queryURL + $.param(queryParams));
        return queryURL + $.param(queryParams);
    }

    function updatePage(WeatherData) {

    }

    $("#search-button").on("click", function (event) {

        event.preventDefault();

        // clear();

        var queryURL = buildQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){

        var latlonURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon +"&exclude=minutely,hourly&appid=7e254ff99ca72e0b2e785026f47b52f0";
            console.log(latlonURL)
        $.ajax({
            url: latlonURL,
            method: "GET",
        }).then(updatePage)
        });
    })
});