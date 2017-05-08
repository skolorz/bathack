var request = require("request"),
    restify = require('restify'), 
    qs = require('querystring'),
    storage = require('node-persist'),
    consumerkey = require('./consumerkey.json'),
    login,
    host = 'http://52.164.126.252';

storage.initSync();
login = process.argv[2] || 'default';
// STEP 1
function initiate(loginOauth) {
	request.post({url:host + '/oauth/initiate', oauth: loginOauth}, 
	  function (e, r, body) {
		var oauth, req_data = qs.parse(body);
		if (e){
			console.log("error", e);
			return;
		}
		console.log("oauth:", req_data);
  // STEP 3
		console.log("authorize here for ing", 
			    "http://52.164.126.252/oauth_ing?oauth_token="
			    + req_data.oauth_token);
		console.log("authorize here for gringotts", 
			    "http://52.164.126.252/oauth_gringotts?oauth_token="
			    + req_data.oauth_token);
		console.log("authorize here for gotham", 
			    "http://52.164.126.252/oauth_gotham?oauth_token="
			    + req_data.oauth_token);
		oauth = {
			consumer_key: consumerkey.CONSUMER_KEY,
			consumer_secret: consumerkey.CONSUMER_SECRET,
			token: req_data.oauth_token,
			token_secret: req_data.oauth_token_secret
		};
		handleAuthCallback(oauth, getToken);
	})
}

function handleAuthCallback(oauth, callback){
  var server = restify.createServer();
  function respond(req, res, next) {
	var query = qs.parse(req.query());
	oauth.verifier = query.oauth_verifier;
	callback(oauth);
        res.send(JSON.stringify(oauth));
        server.once('after', function () {
            server.close();
        });
        next();
  }
  server.get('/auth', respond);
  server.head('/auth', respond);

  server.listen(8080, function() {
      console.log('%s listening at %s', server.name, server.url);
  });
}

// STEP 4
function getToken(oauth) {
	request.post({url:host + '/oauth/token', oauth: oauth}, function (e, r, body) {
		var oauth, req_data = qs.parse(body);
		console.log("token req data:", req_data);
		oauth = {
			consumer_key: consumerkey.CONSUMER_KEY,
			consumer_secret: consumerkey.CONSUMER_SECRET,
			token: req_data.oauth_token,
			token_secret: req_data.oauth_token_secret
		};
		storage.setItemSync('login', login);
		storage.setItemSync(login, oauth);
		console.log("stored: ", oauth);
		process.exit(0);
	});
}


initiate( { 	callback: 'http://localhost:8080/auth', 
		signature_method:"HMAC-SHA1",
		consumer_key: consumerkey.CONSUMER_KEY,
		consumer_secret: consumerkey.CONSUMER_SECRET
	  });
