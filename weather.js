const request = require("request");
const config = require("./config");

var getWeather = (lat, lan, callback) => {
    request ({
        url : 'https://api.darksky.net/forecast/' + config.darksky + '/' + lat + ',' + lan,
        json : true
    }, (error, response, body) => {
        if(error){
            callback('Unable to connect to server try again later !');
        }
        else if (response.statusCode===400){
            callback('Unable to fetch weather try again later !');
        }
        else if(response.statusCode===200){
            callback(undefined, {
                temperature : body.currently.temperature,
                icon : body.currently.icon,
                prediction : body.hourly.summary,
                summary : body.currently.summary,
                wind : body.currently.windSpeed,
                humidity : body.currently.humidity,
                pressure : body.currently.pressure
            })
        }


    });
};

module.exports.getWeather = getWeather;
