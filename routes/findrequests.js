app = require('../app');
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL

app.get('/findrequests', function(req, res){
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