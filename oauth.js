var request = require("request"),
    restify = require('restify'), 
    qs = require('querystring'),
    storage = require('node-persist'),
    CONSUMER_KEY = 'yn3jcqguouvorwo4lofzri5bdsv05dipnsftxkxv',
    CONSUMER_SECRET = '3mhnf1dmgmzkple4n02o0dl1nsdub0xcckzr0idt',
    oauth =
        { callback: 'http://localhost:8080/auth'
        , signature_method:"HMAC-SHA1"
        , consumer_key: CONSUMER_KEY
        , consumer_secret: CONSUMER_SECRET
        },
    host = 'http://52.164.126.252',
    url = host + '/oauth/initiate';

storage.initSync();

function waitForAuthCallback(){
  var server = restify.createServer();
  function respond(req, res, next) {
        var query = qs.parse(req.query());

        oauth.oauth_token = query.oauth_token;
        oauth.oauth_verifier = query.oauth_verifier;
        storage.setItemSync('oauth', oauth);
        
        res.send(JSON.stringify(oauth));

        server.once('after', function () {
            console.log("done");
            server.close();
            process.exit(0);
        });
        next();
  }
  server.get('/auth', respond);
  server.head('/auth', respond);

  server.listen(8080, function() {
      console.log('%s listening at %s', server.name, server.url);
  });
}


request.post({url:url, oauth:oauth}, function (e, r, body) {
        var req_data = qs.parse(body);
        if (e){
                console.log("error", e);
                return;
        }
        console.log("oauth:", req_data);
        console.log("authorize  here", 
                    "http://52.164.126.252/oauth_gotham?oauth_token="
                    + req_data.oauth_token);
        oauth.oauth_token_secret = req_data.oauth_token_secret;
        waitForAuthCallback();
})
