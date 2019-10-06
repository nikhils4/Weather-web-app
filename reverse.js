const request = require("request");
const config = require('./config');

var reverse = (lat, lan, callback) => {
    request ({
        url : 'https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + lan + '&pretty=1&key=' + config.opencage + ',
        json : true
    }, (error, response, body) => {
        if(error){
            callback('Unable to connect to server try again later !');
        }
        else{
            callback(undefined, {
                address : body.results[0].formatted
            });
        }
    });
};

module.exports.reverse = reverse;
