const request = require('request');

var geocodeAddress = (address, callback) => {
    request({
        url: 'http://mapquestapi.com/geocoding/v1/address?key=gi58AiucSCUsY9AbnjXJxlr0zvkN3Ux8&location=' + address,
        json: true
    }, (error, response, body) => {
        if (error != null) // mistake from user end
        {
            callback("Please check your Internet connection and try again later !");
        }
        else if (body.info.statuscode == 400) {  // mistake from server end
            callback("Hey, no such place exist try entering some other place !");
        }
        else if (body.info.statuscode == 0){
            callback(undefined, {
                latitute: body.results[0].locations[0].latLng.lat,
                longitude: body.results[0].locations[0].latLng.lng,
                street : body.results[0].locations[0].street,
                area5 : body.results[0].locations[0].adminArea5,
                state : body.results[0].locations[0].adminArea3,
                country : body.results[0].locations[0].adminArea1
            });


        }
    });
};

module.exports.geocodeAddress = geocodeAddress;