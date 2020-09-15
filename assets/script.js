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
        var date = new Date(WeatherData.current.dt * 1000)
        dateStr = (date.getMonth()+1).toString() + "/" + date.getDate()+ "/" + date.getFullYear();
        $("#date").text(dateStr);
        $("#todayIcon").attr("src", "http://openweathermap.org/img/wn/"+ WeatherData.current.weather[0].icon +"@2x.png");
        $("#todayTemp").text(WeatherData.current.temp);
        $("#todayHumidity").text(WeatherData.current.humidity);
        $("#todayWindspeed").text(WeatherData.current.wind_speed);
        $("#todayUV").text(WeatherData.current.uvi);
        if(WeatherData.current.uvi>7){
            $("#todayUV").addClass("tag is-danger");
        }
        else if(WeatherData.current.uvi>2){
            $("#todayUV").addClass("tag is-warning");
        }
        else{
            $("#todayUV").addClass("tag is-success");
        }
        for(var i = 0; i < 5; i++){
            var date = new Date(WeatherData.daily[i+1].dt * 1000)
        dateStr = (date.getMonth()+1).toString() + "/" + date.getDate()+ "/" + date.getFullYear();
        $("#day"+i+"Date").text(dateStr);
        $("#day"+i+"Icon").attr("src", "http://openweathermap.org/img/wn/"+ WeatherData.daily[i+1].weather[0].icon +"@2x.png");
        $("#day"+i+"Temp").text(WeatherData.daily[i+1].temp.max);
        $("#day"+i+"Humidity").text(WeatherData.daily[i+1].humidity);
        }
        
    }

    function updateHistory(WeatherData) {};

    $("#search-button").on("click", function (event) {

        event.preventDefault();

        var queryURL = buildQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            updateHistory(response);
            $("#cityName").text(response.name);
            var latlonURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&exclude=minutely,hourly&units=imperial&appid=7e254ff99ca72e0b2e785026f47b52f0";
            console.log(latlonURL)
            $.ajax({
                url: latlonURL,
                method: "GET",
            }).then(updatePage)
        });
    })
});