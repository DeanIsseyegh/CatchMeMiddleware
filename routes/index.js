
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
	
	console.log('About to parse json');
	console.dir(req.body);
	console.log('About to send back in response');
	res.send(req.body);

	mongo.Db.connect(mongoUri, function (err, db) {
    	db.collection('mydocs', function(er, collection) {
    		//collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    		collection.insert(req.body, {safe: true}, function(er,rs) {

    		});
  		});
	});

});
