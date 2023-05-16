const express = require("express");
const router = express.Router();
const request = require("request");
const cache = require("../../routeCache");
const checkAuth = require("../../middleware/checkAuth");

const apiKey = "a4b77319ccf64ed2b3885048c6ba4075";

/*
GET /weather/current?city=cityName
The query parameter is city
The request is authenticated using the checkAuth middleware
The response is cached for 10 minutes using the routeCache 
The response is sent as JSON
The response contains the following properties:
message: A string containing the weather information
location: The name of the city
temperature: The temperature in degrees Celsius
humidity: The humidity in percentage
pressure: The pressure in hPa
windSpeed: The wind speed in m/s
clouds: The cloudiness in percentage
weather: A string describing the weather
refreshTime: The time when the weather information was retrieved
provider: The name of the weather provider
*/
router.get("/current", checkAuth, cache(10), (req, res, next) => {
    const city = req.query.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    request(url, function (err, response, body) {
        if(err){
            res.status(500).json({
                message: "Error retrieving weather data from OpenWeatherMap"
                });
        } else {
            const weather = JSON.parse(body);
            if(weather.main == undefined){
                res.status(404).json({
                    message: "No information ! You may have entered the wrong city name."
                    });
            } else {
                const weatherText = `Location : ${weather.name} 
                Temperature : ${weather.main.temp} degrees 
                Humidity : %${weather.main.humidity} 
                Pressure : ${weather.main.pressure} hPa
                Wind Speed : ${weather.wind.speed} m/s
                Clouds : %${weather.clouds.all} 
                Weather : ${weather.weather[0].description} `
                
                res.status(200).json({
                    message: weatherText,
                    location: weather.name,
                    temperature: weather.main.temp,
                    humidity: weather.main.humidity,
                    pressure: weather.main.pressure,
                    windSpeed: weather.wind.speed,
                    clouds: weather.clouds.all,
                    weather: weather.weather[0].description,
                    refreshTime: new Date(),
                    provider: "OpenWeatherMap"
                    });
                }
            }
        });
    });

/*
GET /weather/forecast?city=cityName&upperHourLimit=upperHourLimit&lowerHourLimit=lowerHourLimit
The query parameters are city, upperHourLimit and lowerHourLimit
The request is authenticated using the checkAuth middleware
The response is cached for 10 minutes using the routeCache
The response is sent as JSON
The response contains the following properties:
location: The name of the city  
forecast: An array of forecasts from lowerHourLimit later to upperHourLimit later.
Containing the following properties:
weather: A string describing the weather
temperature: The temperature in degrees Celsius
humidity: The humidity in percentage
pressure: The pressure in hPa
windSpeed: The wind speed in m/s
clouds: The cloudiness in percentage
time: The time when the weather information was retrieved
refreshTime: The time when the weather information was retrieved
provider: The name of the weather provider
*/

router.get("/forecast", checkAuth, cache(10), (req, res, next) => {
    const city = req.query.city;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    request(url, function (err, response, body) {
        if(err){
            res.status(500).json({
                message: "Error retrieving weather data from OpenWeatherMap"
                });
        } else {
            const weather = JSON.parse(body);
            if(weather.city == undefined){
                res.status(404).json({
                    message: "No information ! You may have entered the wrong city name."
                    });
            } else {
        
            var forecastList = [];
            currentTime = new Date().getTime();
            let upperLimit = new Date(currentTime + parseInt(req.query.upperHourLimit) * 60 * 60 * 1000).getTime();
            let lowerLimit = new Date(currentTime + parseInt(req.query.lowerHourLimit) * 60 * 60 * 1000).getTime();
            
            for (var i = 0; i < weather.list.length; i++) {
                var time = new Date(weather.list[i].dt * 1000).getTime();
                if (time > lowerLimit && time < upperLimit) {
                    forecastList.push({weather: weather.list[i].weather[0].description,
                        temperature: weather.list[i].main.temp,
                        humidity: weather.list[i].main.humidity,
                        pressure: weather.list[i].main.pressure,
                        windSpeed: weather.list[i].wind.speed,
                        clouds: weather.list[i].clouds.all,
                        time: weather.list[i].dt_txt
                    });
                }
            }

            res.status(200).json({
                location: weather.city.name,
                forecast: forecastList,
                refreshTime: new Date(),
                provider: "OpenWeatherMap"
                });
            }
            }
        });
    });

/*
GET /weather/history?city=cityName&countryCode=countryCode&upperHourLimit=upperHourLimit&lowerHourLimit=lowerHourLimit
The query parameters are city, countryCode, upperHourLimit and lowerHourLimit
The request is authenticated using the checkAuth middleware
The response is cached for 10 minutes using the routeCache
The response is sent as JSON
The response contains the following properties:
city_id: The id of the city
history: An array of weather history from upperHourLimit hours ago to lowerHourLimit hours ago.
Containing the following properties:
weather: A string describing the weather
temperature: The temperature in degrees Celsius
humidity: The humidity in percentage
pressure: The pressure in hPa
windSpeed: The wind speed in m/s
clouds: The cloudiness in percentage
time: The time when the weather information was retrieved
refreshTime: The time when the weather information was retrieved
provider: The name of the weather provider
*/
router.get("/history", checkAuth, cache(10), (req, res, next) => {
    const city = req.query.city;
    const countryCode = req.query.countryCode;
    currentTime = new Date().getTime();
    let lowerTime = Math.floor(new Date(currentTime - parseInt(req.query.upperHourLimit) * 60 * 60 * 1000).getTime() / 1000);
    let upperTime = Math.floor(new Date(currentTime - parseInt(req.query.lowerHourLimit) * 60 * 60 * 1000).getTime() / 1000);
    const url = `http://history.openweathermap.org/data/2.5/history/city?q=${city},${countryCode}&type=hours&start=${lowerTime}&end=${upperTime}&units=metric&appid=${apiKey}`;
    request(url, function (err, response, body) {
        if(err){
            res.status(500).json({
                message: "Error retrieving weather data from OpenWeatherMap"
                });
        } else {
            const weather = JSON.parse(body);
            if(weather.city_id == undefined){
                res.status(404).json({
                    message: "No information ! You may have entered the wrong city name or country code."
                    });
            } else {
            
            var historyList = [];


            for (var i = 0; i < weather.list.length; i++) {
                historyList.push({weather: weather.list[i].weather[0].description,
                temperature: weather.list[i].main.temp,
                humidity: weather.list[i].main.humidity,
                pressure: weather.list[i].main.pressure,
                windSpeed: weather.list[i].wind.speed,
                clouds: weather.list[i].clouds.all,
                time: new Date(weather.list[i].dt * 1000)
                });    
            }

            res.status(200).json({
                city_id: weather.city_id,
                history: historyList,
                refreshTime: new Date(),
                provider: "OpenWeatherMap"
                });
            }
            }
        });
    });


module.exports = router;
