# Weather API

RESTful API for weather that gets data from OpenWeatherMap.


## API Reference

#### Get current weather

`http GET /weather/current`

| Parameter | Type     | Description                | Parameter Type|
| :--------   | :------- | :------------------------- |:------- |
| `city`         | `string` | **Required**. City Name | query|
| `x-auth-token` | `string` | **Required**. Token |header|

#### Get weather forecast

`http GET /weather/forecast`

| Parameter | Type     | Description                       |Parameter Type|
| :-------- | :------- | :-------------------------------- |:------- |
| `city`         | `string` | **Required**. City Name |query|
| `upperHourLimit`         | `integer` | **Required**. Forecast up to next upperHourLimit hours | query|
| `lowerHourLimit`         | `integer` | **Required**. Forecast from lowerHourLimit hours later | query|
| `x-auth-token` | `string` | **Required**. Token |header|

#### Get weather history

`http GET /weather/history`

| Parameter | Type     | Description                       |Parameter Type|
| :-------- | :------- | :-------------------------------- |:------- |
| `city`         | `string` | **Required**. City Name |query|
| `upperHourLimit`         | `integer` | **Required**. Weather history from previous upperHourLimit hours | query|
| `lowerHourLimit`         | `integer` | **Required**. Weather history up to previous lowerHourLimit hours | query|
| `countryCode`         | `string` | **Required**. Country Code |query|
| `x-auth-token` | `string` | **Required**. Token |header|



#### Sign up

`http POST /authentication/signup`

| Parameter | Type     | Description                | Parameter Type|
| :--------   | :------- | :------------------------- |:------- |
| `email`         | `string` | **Required**. Email | body|
| `password` | `string` | **Required**. Password |body|


#### Login

`http POST /authentication/login`

| Parameter | Type     | Description                | Parameter Type|
| :--------   | :------- | :------------------------- |:------- |
| `email`         | `string` | **Required**. Email | body|
| `password` | `string` | **Required**. Password |body|


## Postman Collection

https://www.postman.com/descent-module-engineer-29973534/workspace/weather-api/collection/27435858-5278a61b-7803-41f9-8b37-c9de30d46655?action=share&creator=27435858

## Installation

The following dependencies and nodejs must be installed on your computer to run the program.

    "bcrypt": "5.1.0",
    "body-parser": "1.20.2",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.0",
    "morgan": "1.10.0",
    "node-cache": "5.1.2",
    "request": "2.88.2",
    "swagger-ui-express": "4.6.3"

After installation you can use the following command to run the program:

  `node server.js`
