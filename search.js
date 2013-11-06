//Search function
//@param {String} search query
//@param {Function} callback
//@api public
var request = require('superagent');
var express = require('express');
var app = express();

app.get('./search', function (req, res, next) {
	search(req.query.q, function (err, tweets) {
		if (err) return next(err);
	});
		res.render('search', { results: tweets, search: req.query.q });
});

module.exports = function search (query, fn) {
	request.get('http://search.twitter.com/search.json')
		.data({ q: query })
		.end(function (res) {
			if (res.body && Array.isArray(res.body.results)) {
				return fn(null, res.body.results);
			}
		});
};