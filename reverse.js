const request = require("request");


var reverse = (lat, lan, callback) => {
    request ({
        url : 'https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + lan + '&pretty=1&key=5db5a96f174d46e389853c0ec12d44a2',
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