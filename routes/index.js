
/*
 * GET home page.
 */

app = require('../app');

app.get('/', function(req, res){
	res.send('home!');
})

app.post("/", function(req, res){
	console.log('POST /');
	console.dir(req.body);
	res.writeHead(200, {'Content-type': 'application/json'});
	//res.end("thanks");
})