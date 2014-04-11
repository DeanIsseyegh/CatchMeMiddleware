app = require('../app'); 
var mongo = require('mongodb'); //get mongoDb dependency
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL //get environmental variable that contains database name

/////////////////////////////////////////////
///////		Response Json Objects   /////////
/////////////////////////////////////////////
var success = {'res' : 0}
var errConnectToDB = {'res' : 1};
var errCollection = {'res' : 2};
var errEnsureIndex = {'res' : 3};
var errUpdate = {'res' : 4};
var errCommand = {'res' : 5};
var errFindOne = {'res' : 6};
var errInsert = {'res' : 7};
var errUsernameAlreadyTaken = {'res' : 8};
var errUsernameAndPassDontMatch = {'res' : 9};
var errNoOneNearby = {'res' : 10};

/////////////////////////////////////////////
///////		Insert/update location  /////////
/////////////////////////////////////////////

app.post("/", function(req, res){
	var jsonObj = req.body; 
	var username = jsonObj['Username'];
	var longitude = jsonObj['longitude'];
	var latitude = jsonObj['latitude'];
	var geoJsonObj = {'Username': username, location: {"type" : "Point", "coordinates" : [longitude, latitude]}};
	mongo.Db.connect(mongoUri, function (err, db) {
		if (err)
			res.send(errConnectToDB);
    	db.collection('catchmerequests', function(err, collection) {
    		if (err)
    			res.send(errCollection);
    		collection.ensureIndex({ location : "2dsphere" }, function (err, collection) {});
    		collection.update({'Username':username}, {$set: geoJsonObj}, {upsert:true}, function(err,result) {
    			if (err)
    				res.send(errUpdate);
   				else
   					res.send(success);
    		}); // end of collection.update
  		}); // end of db.collection
	});	// end of mongo.Db.connect
}); // end of app.post


/////////////////////////////////////////////
///////			Find requests		/////////
/////////////////////////////////////////////

app.post('/findrequests', function(req, res){
	var longitude = jsonObj['longitude'];
	var latitude = jsonObj['latitude'];
	var searchDistance = 5000; //In meters
	mongo.Db.connect(mongoUri, function (err, db) {
		
    	db.collection('catchmerequests', function(err, collection) {
    		if (err)
    			res.send(errCollection);

    		db.command( { geoNear : 'catchmerequests', near: { type: 'Point', 
			coordinates : [longitude, latitude] }, spherical : true, maxDistance : searchDistance}, 
			function(err, result){
				if (err)
					res.send(errCommand);
		
                	console.log(result);
                	if (result)
                	{
                		var arra = result.toArray();
                		console.log()
                		res.send(success);
                	}
                	else
                		res.send(errNoOneNearby);
            }); // end of db.command geoNear
  		}); //end of db.collection
	}); // end of mongo.Db.connect
}); // end of app.get


/////////////////////////////////////////////
///////			Register User  		/////////
/////////////////////////////////////////////

app.post("/register", function(req, res){
	var jsonObj = req.body; 
	var username = jsonObj['Username'];
	var email = jsonObj['Email'];
	var password = jsonObj['Password'];

	mongo.Db.connect(mongoUri, function (err, db) {
		if (err)
			res.send(errConnectToDB);
    	db.collection('registeredusers', function(err, collection) {
    		if (err)
    			res.send(errCollection);
    		collection.ensureIndex('Username', {unique: true}, function (err, collection) {});
    		collection.findOne({'Username':username}, function(err, document) {
    			if (err)
    				res.send(errFindOne);

    			if (!document){
    			collection.insert(jsonObj, function(err,result) {
    				if (err)
    					res.send(errInsert);
    				else
    					res.send(success)
    			}); // end of collection.insert
    			} // end of if !document
    			else { res.send(errUsernameAlreadyTaken) }; // Means that findOne returned document, user already exists
    		}); // end of collection.findOne
  		}); // end of db.collection
	});	// end of mongo.Db.connect
}); // end of app.post

/////////////////////////////////////////////
///////	  Authenticate/Login User   /////////
/////////////////////////////////////////////

app.post("/login", function(req, res){
	var jsonObj = req.body; 
	var username = jsonObj['Username'];
	var password = jsonObj['Password'];

	mongo.Db.connect(mongoUri, function (err, db) {
		if (err)
			res.send(errConnectToDB);
    	db.collection('registeredusers', function(err, collection) {
    		if (err)
    			res.send(errCollection);
    		collection.ensureIndex('Username', {unique: true}, function (err, collection) {});
    		collection.findOne({'Username':username, 'Password':password}, function(err, document) {
    			if (err)
    				res.send(errFindOne);

    			if (document){
    				res.send(success)
    			} // end of if document
    			else { res.send(errUsernameAndPassDontMatch) };
    		}); // end of collection.findOne
  		}); // end of db.collection
	});	// end of mongo.Db.connect
}); // end of app.post

/////////////////////////////////////////////
///////			Example Code		/////////
/////////////////////////////////////////////

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
             }); // end of db.command geoNear
  		}); //end of db.collection
	}); // end of mongo.Db.connect
}); // end of app.get

/**db.catchmerequests.find({"location":{$near:{$geometry:
    {type:"Point", coordinates:[50.0 , -0.1330]}, $maxDistance:500}}})

db.runCommand( { geoNear : 'catchmerequests', near: { type: 'Point', 
coordinates : [50, 50] }, spherical : true, maxDistance : 5000000 } );
*/