const express = require('express');
const hbs = require('hbs');
const geocode = require('./geocode.js');
const weather = require('./weather.js');
const reverse = require('./reverse.js');
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 8080;

var app = express();
app.use(express.static(__dirname + '/views/images') );
app.set('view engine', hbs);


app.get('/', (req,res) => {
    res.render('front.hbs');
});

app.get('/res', (req,res) => {
    if (/[^a-zA-Z0-9 ,]/i.test(req.query.location)){
        res.render('result.hbs', {
            error : "Hey, this is not the valid input. Try entering some other place."
        })
    }
    else {
        geocode.geocodeAddress(req.query.location, (errorMessage, results) => {
            if (errorMessage) {
                res.render('result.hbs', {
                    error : errorMessage
                })

            }
            else if (req.query.location == ' ' ) {
                res.render('result.hbs', {
                    error : errorMessage
                })

            }
            else {
                weather.getWeather(results.latitute, results.longitude, (errorMessage, weatherResults) => {
                    if (errorMessage) {
                        res.render('result.hbs', {
                            error: errorMessage
                        })
                    }
                    else {
                        res.render('result.hbs', {
                            street : results.street + ' ',
                            area5 : results.area5 + ' ',
                            state : results.state + ' ' ,
                            country : results.country,
                            predict : weatherResults.prediction,
                            tempF : Math.round(weatherResults.temperature),
                            tempC : Math.round((weatherResults.temperature - 32)*(5/9)),
                            icon : weatherResults.icon,
                            body : JSON.stringify(results.body, undefined, 2),
                            summary : weatherResults.summary,
                            wind : weatherResults.wind,
                            humidity : Math.round((weatherResults.humidity)*100),
                            url : encodeURIComponent( results.street + ' ' + results.area5 + " " + results.state + " " + results.country )
                        });
                        var ur =  process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-search'; // for local host replace with it 'mongodb://localhost:27017/weather-search';
                        MongoClient.connect(ur,{ useNewUrlParser: true }, (erro,client) => {
                            if (erro){
                                return console.log('Unable to connect', erro);
                            };

                            console.log('Connected sucessfully');
                            const db = client.db('weather-search');
                            db.collection('Weather-Data').insertOne({
                                'Location' : results.street + ' ' +  results.area5 + " "+ results.state + " " + results.country,
                                'Temperature (deg C)' : Math.round((weatherResults.temperature - 32)*(5/9)),
                                'Wind (km/hr)' : weatherResults.wind,
                                'Humidity (%)' : Math.round((weatherResults.humidity)*100),
                                'TimeZone' : new Date().getTimezoneOffset(),
                                'Date' : new Date().toLocaleString("en-US", {timeZone: "Asia/Calcutta"}),
                                'Live' : 'False'
                            }, (erro, result) => {
                                if (erro) {
                                    return console.log('Unable to add the weather data', erro);
                                }
                                console.log(JSON.stringify(result.ops, undefined, 2));
                            })
                            client.close();
                        });
                    }
                });


            }
        });



    }

});


app.get('/locate', (req,res) => {
    reverse.reverse(req.query.name_lat, req.query.name_lng, (errorMessage, nameresults) => {
        if(errorMessage) {
            res.render('result.hbs', {
                error : errorMessage
            })
        }
        else {
            geocode.geocodeAddress(nameresults.address, (errorMessage, results) => {
                if (errorMessage) {
                    res.render('result.hbs', {
                        error : errorMessage
                    })

                }
                else {
                    weather.getWeather(results.latitute, results.longitude, (errorMessage, weatherResults) => {
                        if (errorMessage) {
                            res.render('result.hbs', {
                                error: errorMessage
                            })
                        }
                        else {
                            res.render('result.hbs', {
                                street : results.street + ' ',
                                area5 : results.area5 + ' ',
                                state : results.state + ' ' ,
                                country : results.country,
                                predict : weatherResults.prediction,
                                tempF : Math.round(weatherResults.temperature),
                                tempC : Math.round((weatherResults.temperature - 32)*(5/9)),
                                icon : weatherResults.icon,
                                body : JSON.stringify(results.body, undefined, 2),
                                summary : weatherResults.summary,
                                wind : weatherResults.wind,
                                humidity : Math.round((weatherResults.humidity)*100),
                                url : encodeURIComponent( results.street + ' ' + results.area5 + " "+ results.state + " " + results.country)

                            });
                            var ur = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-search'; // for local host replace with it 'mongodb://localhost:27017/weather-search';
                            MongoClient.connect(ur,{ useNewUrlParser: true }, (erro,client) => {
                                if (erro){
                                    return console.log('Unable to connect', erro);
                                };

                                console.log('Connected sucessfully');
                                const db = client.db('weather-search');
                                db.collection('Weather-Data').insertOne({
                                    'Location' : results.street + ' ' + results.area5 + " "+ results.state + " " + results.country,
                                    'Temperature (deg C)' : Math.round((weatherResults.temperature - 32)*(5/9)),
                                    'Wind (km/hr)' : weatherResults.wind,
                                    'Humidity (%)' : Math.round((weatherResults.humidity)*100),
                                    'TimeZone' : new Date().getTimezoneOffset(),
                                    'Date' : new Date().toLocaleString("en-US", {timeZone: "Asia/Calcutta"}),
                                    'Live' : 'True'
                                }, (erro, result) => {
                                    if (erro) {
                                        return console.log('Unable to add the weather data', erro);
                                    }
                                    console.log(JSON.stringify(result.ops, undefined, 2));
                                })
                                client.close();
                            });
                        }
                    });
                }
            });
        }
    });

});

app.listen(port, () => {
    console.log('Server is up at port ' + port);
});

