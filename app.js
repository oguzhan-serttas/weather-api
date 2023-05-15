const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const weatherRoutes = require("./api/routes/weather");
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');


// log requests
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));   

app.use("/weather", weatherRoutes);

// error handling
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error); // forwards the error request
    });  
  
module.exports = app;
