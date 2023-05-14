const express = require("express");
const router = express.Router();
const request = require("request");

const apiKey = "a4b77319ccf64ed2b3885048c6ba4075";

router.get("/current", (req, res, next) => {
    const city = req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    request(url, function (err, response, body) {
        if(err){
            res.status(500).json({
                message: "Error retrieving weather data from OpenWeatherMap"
                });
        } else {
            const weather = JSON.parse(body);
            if(weather.main == undefined){
                res.status(500).json({
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
                    weather: weather.weather[0].description
                    });
                }
            }
        });
    });


router.get("/forecast", (req, res, next) => {
    const city = req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    console.log(url);
    request(url, function (err, response, body) {
        if(err){
            res.status(500).json({
                message: "Error retrieving weather data from OpenWeatherMap"
                });
        } else {
            const weather = JSON.parse(body);
            if(weather.city == undefined){
                res.status(500).json({
                    message: "No information ! You may have entered the wrong city name."
                    });
            } else {
        
            var forecastList = [];
            currentTime = new Date().getTime();
            let upperLimit = new Date(currentTime + parseInt(req.body.upperLimit) * 60 * 60 * 1000).getTime();
            let lowerLimit = new Date(currentTime + parseInt(req.body.lowerLimit) * 60 * 60 * 1000).getTime();
            
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
                forecast: forecastList
                });
            }
            }
        });
    });

module.exports = router;