
/*
 * GET home page.
 */
app = require('../app');
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL

app.get('/', function(req, res){
	res.send('homeUpdated!');
})

app.post("/", function(req, res){
	//console.log('POST /');
	//console.dir(req.body);
	
	//console.log('About to parse json');
	//console.dir(req.body);
	//console.log('About to send back in response');
	var jsonObj = req.body;
	var obj = JSON.stringify(req.body);
	console.log(obj);
	console.log(jsonObj['Username']);
	res.send(req.body);

	mongo.Db.connect(mongoUri, function (err, db) {

    	db.collection('catchmerequests', function(err, collection) {

    		//collection.update(req.body, {w:1}, function(err,result) {

    		//});
  		});
	});

});
