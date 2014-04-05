
/*
 * GET home page.
 */
app = require('../app');
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL

app.get('/', function(req, res){
	mongo.Db.connect(mongoUri, function (err, db) {
		
    	db.collection('catchmerequests', function(err, collection) {

    		db.ensureIndex('catchmerequests', { location : "2dsphere" }, function (err, collection) {});
    		collection.find( { location :
                   { $near : [ 51.50998001 , -0.13375500 ] ,
                     $maxDistance : 10000000000000000000000
                }}, function(err, result){
                	console.log('Ok, about to do stuff');
                	result.toArray(function(err, docs){
   						 console.log("retrieved records:");
   						 console.log(docs);
   						 res.send(docs);
					});
                });
  		});
	});

	//res.send('homeUpdated!');
})

app.post("/", function(req, res){
	//console.log('POST /');
	//console.dir(req.body);
	
	//console.log('About to parse json');
	//console.dir(req.body);
	//console.log('About to send back in response');
	var jsonObj = req.body; 
	var username = jsonObj['Username'];
	var longitude = jsonObj['longitude'];
	var latitude = jsonObj['latitude'];
	var geoJsonObj = {'Username': username, location: {"type" : "Point", "coordinates" : [longitude, latitude]}};

	//res.send(req.body);

	mongo.Db.connect(mongoUri, function (err, db) {
		if (err)
			res.send(null);

		//db.ensureIndex('catchmerequests', { location : "2dsphere" }, function (err, collection) {});
		
    	db.collection('catchmerequests', function(err, collection) {
    		if (err)
    			res.send(null);
    		db.ensureIndex('catchmerequests', { location : "2dsphere" }, function (err, collection) {});
    		collection.update({'Username':username}, {$set: geoJsonObj}, {upsert:true}, function(err,result) {
    			if (err)
    				res.send(null);
    			else
    				res.send(jsonObj);
    		});
  		});
	});

});

//db.foo.insert({name: username, location: {"type" : "Point", "coordinates" : [longitude, latitude]}})