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
    jsonfile.writeFile('./' + login + '-accounts.json', acc, {spaces: 2}, function(err) {
      console.error(err || ("accounts " + acc.length + " " + login + '-accounts.json')) 
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
  save(accounts);
  if (accounts.length) {
    var account = accounts[0];

    console.log("query details");
    url = host + prefix + "/banks/"+account.bank_id + "/accounts/" + account.id +"/owner/account"; 
    //url = host + prefix + "/banks/"+account.bank_id + "/accounts/" + account.id +"/views"; 
    //request.get({url: accounts[0]._links.detail.href, oauth: oauth}, function (e, r, body) {
    request.get({url: url, oauth: oauth}, function (e, r, body) {
      console.log("ok");
      if (e){
          console.log("error", e);
          return;
      }
      account.details =  JSON.parse(body);
      save(accounts);
    })
  }
})
