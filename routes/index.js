var express = require('express');
var router = express.Router();
var request = require('request');
var mongodb = require('mongodb');


// We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var dbUrl = 'mongodb://localhost:27017/';

// we will use this variable later to insert and retrieve a "collection" of data
var collection;

MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  }
  else {
    // HURRAY!! We are connected. :)
    console.log('Connection established to', dbUrl);
    // do some work here with the database.
    var db = client.db('quotes'); //Connect to the database
    db.createCollection('quote', function(err, result) {
      collection = result;

      collection.stats(function(err, stats) {
        if (err) { console.log(err) }
        if (stats.count == 0) { // If we havent inserted before, put the default in
          collection.insertMany(quotes, function(err, result) {
            if (err) { console.log(err) }
            else {
              console.log('Inserted documents into the "quote" collection. The documents inserted with "_id" are:', result.length, result);
            }
          });
        }
      });
    }); // Get the collection
  }
});



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/quotes', function(req, res) {
    console.log("In Quotes");
    collection.find().toArray(function(err, result){
       if (err) { console.log(err); }
    else if (result.length) {
      console.log("Query Worked");
      console.log(result);
      res.send(result);
    }
    else {
      console.log("No Documents found");
    }
    });
    
});

router.post('/quotes', function(req, res){
    console.log("In Quotes post");
    collection.insertOne(req.body, function(err, result)
    {
        if(err){
            console.log(err);
        }
        else{
            console.log('Inserted document into "quotes" collection');
            res.end('{"success" : "Updated Successfully", "status" : 200}');
        }
    });
});

router.delete('/quotes/:quote', async (req, res) => {
  console.log("In delete");
  try {
    await collection.deleteOne({
      quote: req.params.quote
    });
    console.log(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

var quotes = [{
        quote: 'Make your life a masterpiece; imagine no limitations on what you can be, have or do.',
        author: 'Briain Tracy'
    },
    {
        quote: 'The way to get started is to quit talking and begin doing.',
        author: 'Walt Disney'
    },
];

module.exports = router;
