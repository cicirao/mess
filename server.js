//Module requirements
var express = require('express')
	, search = require('./search');
//Create app
var app = express();
//Configuration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });
//Routes
app.get('/', function (req, res) {
	res.render('index');
});
//Listen
app.listen(3000);