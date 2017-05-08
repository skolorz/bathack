var request = require("request"),
jsonfile = require('jsonfile'),
qs = require('querystring'),
storage = require('node-persist'),
oauth, login,
host = 'http://52.164.126.252',
prefix = '/obp/v2.1.0',
url = host + prefix + '/my/accounts';

storage.initSync();
login = process.argv[2] || storage.getItemSync('login');
oauth = storage.getItemSync(login);

function save(acc) {
    jsonfile.writeFile('./' + login + '-transactions.json', acc, {spaces: 2}, function(err) {
      console.error(err || ("accounts " + acc.length + " " + login + '-transactions.json')) 
    })
}

console.log("query list");
request.get({url: url, oauth: oauth}, function (e, r, body) {
	var accounts;
  console.log("ok");
  if (e){
      console.log("error", e);
      return;
  }
	accounts =  JSON.parse(body);
  console.log("accounts ", accounts.length);
  if (accounts.length) {
    var account = accounts[0];

    url = host + prefix + "/banks/"+account.bank_id + "/accounts/" + account.id +"/owner/transactions"; 
    console.log("query details", url);
    request.get({url: url, oauth: oauth}, function (e, r, body) {
      console.log("ok");
      if (e){
          console.log("error", e);
          return;
      }
      account.transactions =  JSON.parse(body);
      save(accounts);
    })
  }
})
