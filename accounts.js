var request = require("request"),
jsonfile = require('jsonfile'),
qs = require('querystring'),
storage = require('node-persist'),
oauth,
host = 'http://52.164.126.252',
prefix = '/obp/v2.1.0',
url = host + prefix + '/my/accounts';

storage.initSync();
oauth = storage.getItemSync('oauth');

request.get({url: url, oauth: oauth}, function (e, r, body) {
	var accounts;
        if (e){
                console.log("error", e);
		return;
        }
	accounts =  JSON.parse(body);
	console.log(typeof body);
	jsonfile.writeFile('./accounts.json', accounts, {spaces: 2}, function(err) {
		console.error(err || "accounts ok") 
	})
})
