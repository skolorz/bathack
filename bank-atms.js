var request = require("request"),
jsonfile = require('jsonfile'),
qs = require('querystring'),
storage = require('node-persist'),
oauth, login, bank,
host = 'http://52.164.126.252',
prefix = '/obp/v2.1.0',
url = host + prefix;

storage.initSync();
login = process.argv[2] || storage.getItemSync('login');
oauth = storage.getItemSync(login);
bank = process.argv[3] || 'ing';
url = url + '/banks/' + bank + "/accounts";
console.log("query list", url);
request.get({url: url, oauth: oauth}, function (e, r, body) {
	var accounts;
  console.log("ok");
  if (e){
      console.log("error", e);
      return;
  }
	accounts =  JSON.parse(body);
  console.log(accounts);
})
