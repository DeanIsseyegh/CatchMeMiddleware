
/*
 * GET home page.
 */
app = require('../app');
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL

app.get('/', function(req, res){
	mongo.Db.connect(mongoUri, function (err, db) {
		
    	db.collection('catchmerequests', function(err, collection) {
    		if (err)
    			console("erro!");
    		db.command( { geoNear : 'catchmerequests', near: { type: 'Point', 
			coordinates : [50, 50] }, spherical : true, maxDistance : 5000000000 }, 
			function(err, result){
                	console.log(result);
                	res.send(result);
                });
                
  		});
	});
})

/**db.catchmerequests.find({"location":{$near:{$geometry:
    {type:"Point", coordinates:[50.0 , -0.1330]}, $maxDistance:500}}})

db.runCommand( { geoNear : 'catchmerequests', near: { type: 'Point', 
coordinates : [50, 50] }, spherical : true, maxDistance : 5000000 } );
*/
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

/////////////////////////////////////////////
/////////////////////////////////////////////

