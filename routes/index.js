
/*
 * GET home page.
 */
app = require('../app');
var neoReq = require('superagent');

app.get('/', function(req, res){
	res.send('homeUpdated!');
})

app.post("/", function(req, res){
	console.log('POST /');
	console.dir(req.body);
	console.log(process.env.NEO4J_REST_URL);
	neoReq.post(process.env.NEO4J_REST_URL + '/cypher').send({
		query: 'CREATE (n {name:"World"}) RETURN "hello", n.name'
	}).end(function(neo4jRes) {
		res.send(neo4jRes.text);
	});

	res.writeHead(200, {'Content-type': 'application/json'});
	//res.end("thanks");
});