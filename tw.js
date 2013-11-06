var http        = require('http'),
    util        = require('util'),
    URL         = require('url'),
    querystring = require('querystring'),
    OAuth       = require('oauth').OAuth;
 
var oa = new OAuth('https://api.twitter.com/oauth/request_token',
                  'https://api.twitter.com/oauth/access_token',
                  'EtXcMyqnlDgvruH85NKsw',
                  'gFJ7ST2USrrxF6yZwpkE1CmZaZONJ5cFdo1vg2q2ALQ',
                  '1.0',
                  null,
                  'HMAC-SHA1');
 
var callbackUrl = 'http://127.0.0.1:3000/content.html';
var global_secret_lookup = {};
 
http.createServer(function (req, res) {
 
  var reqURL = URL.parse(req.url);
  switch (reqURL['pathname']) {
 
    case '/': // Default case, redirect to Twitter signin
      console.log('Default URL');
      oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
        if(error) {
          console.log('error :' + util.inspect(error));
          var errResponse = 'Unable to retrieve request token';
          res.writeHead(200, {'Content-Type': 'text/plain', 'Content-Length': errResponse.length});
          res.end(errResponse);
        }
        else {
          console.log('oauth_token: ' + oauth_token);
          console.log('oauth_token_secret: ' + oauth_token_secret);
          console.log('requestoken results: ' + util.inspect(results));
 
          // I'm sure there's a better way than storing in a single
          // global variable (it's not threadsafe, but works for illustrations)
          global_secret_lookup[oauth_token] = oauth_token_secret;
          
          // NOTE: we use the AUTHENTICATE, not the AUTHORIZE URL here
          var twitterAuthEndpoint = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + oauth_token;
          console.log('Redirecting to ' + twitterAuthEndpoint);
          res.writeHead(303, {'Content-Type': 'text/plain', 'Location': twitterAuthEndpoint});
          res.end('Redirecting...\n');
        }
      });
      break;
 
    case callbackUrl: // Callback URL case
      console.log('Callback URL');
      var parsedURL = URL.parse(req.url);
      var parsedQuery = querystring.parse(parsedURL.query);
 
      // If there's no oauth_token parameter then the user must have
      // denied access. Bail.
      if(typeof(parsedQuery['oauth_token']) === 'undefined') {
        console.log('User failed to authorize access');
        var accessDenied = 'Please grant access to continue...'
        res.writeHead(200, {'Content-Type': 'text/plain', 'Content-Length': accessDenied.length});
        res.end(accessDenied);
        return;
      }
 
      var oauth_token = parsedQuery['oauth_token'];
      // !IMPORTANT!
      // Grab an access token. Twitter won't remember that the user authorized
      // the application for authentication unless we grab an access token
      oa.getOAuthAccessToken(oauth_token, global_secret_lookup[oauth_token], function(error, oauth_access_token, oauth_access_token_secret, results) {
        console.log('Requested access token');
        console.log('oauth_access_token: ' + oauth_access_token);
        console.log('oauth_token_secret: ' + oauth_access_token_secret);
        console.log('accesstoken results: ' + util.inspect(results));
 
        var stringifiedResults = JSON.stringify(results);
        res.writeHead(200, {'Content-Type': 'text/plain', 'Content-Length': stringifiedResults.length});
        res.end(stringifiedResults);
      });
      delete global_secret_lookup[oauth_token];
      break;
  }
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');