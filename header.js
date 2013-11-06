var OAuth = require('OAuth');
var oauth = new OAuth.OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		'EtXcMyqnlDgvruH85NKsw',
		'gFJ7ST2USrrxF6yZwpkE1CmZaZONJ5cFdo1vg2q2ALQ',
		'1.0A',
		null,
		'HMAC-SHA1'
	);
	oauth.get(
		'https://api.twitter.com/1.1/trends/place.json?id=23424977',
		'1673666990-NISUzo57eNfyztQQuAPxIvMjLPGdXWUWbRFkK5a',
		'8VaUKD7zhmhy4wrMiDN8zMcu61s0ASTCGtdS9EAHg',
		function (e, data, res){
			if (e) console.error(e);
			console.log(require('util').inspect(data));
			done();
		});
	