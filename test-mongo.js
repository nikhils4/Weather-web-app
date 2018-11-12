
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/Weather-Search',{ useNewUrlParser: true }, (erro,client) => {
    if (erro){
        return console.log('Unable to connect');
    };

    console.log('Connected sucessfully');
    const db = client.db('Weather-Search');
    db.collection('Weather-Data').insertOne({
        'place' : 'given',
        'temperature' : 'given',
        'latitude' : 'given',
        'longitude' : 'given'
    }, (erro, result) => {
        if (erro) {
            return console.log('Unable to add the weather data', erro);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    client.close();
});