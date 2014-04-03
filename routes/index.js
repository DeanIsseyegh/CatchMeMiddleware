
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
	
	var jsonObject = JSON.parse(data);
	console.log('About to parse json');
	console.log(jsonObject);

	mongo.Db.connect(mongoUri, function (err, db) {
    	db.collection('mydocs', function(er, collection) {
    		collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {

    		});
  		});
	});

});
