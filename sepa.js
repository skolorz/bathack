var request = require("request"),
storage = require('node-persist'),
prompt = require('prompt'),
oauth, login,
host = 'http://52.164.126.252',
prefix = '/obp/v2.1.0',
url = host + prefix + '/my/accounts';

storage.initSync();
login = process.argv[2] || storage.getItemSync('login');
oauth = storage.getItemSync(login);

console.log("query accounts");
request.get({url: url, oauth: oauth}, function (e, r, body) {
	var accounts, transfer;
  if (e){
      console.log("error", e);
      return;
  }
	accounts =  JSON.parse(body);
  if (accounts.length) {
    var account = accounts[0];
    transfer = {
          "value": {
              "currency": "EUR",
              "amount": "123.50"
          },
          "to": {"iban": "PL18357776666252912113035765"},
          "description": "This is a SEPA Transaction Request",
          "charge_policy": "SHARED"
      }; 
    url = host + prefix + "/banks/" + account.bank_id + 
          "/accounts/" + account.id +"/owner/transaction-request-types/SEPA/transaction-requests"; 
    console.log("transaction-request", url);
    request.post({url: url, oauth: oauth, json: true, body: (transfer)}, function (e, r, transResponse) {
      var transResp;
      console.log("ok");
      if (e){
          console.log("error", e);
          return;
      }
      console.log("transResponse", transResponse);
      if (transResponse.status === 'INITIATED') {
        url = host + prefix + "/banks/" + account.bank_id + 
            "/accounts/" + account.id +"/owner/transaction-request-types/SEPA" +
            "/transaction-requests/" + transResponse.id + "/challenge"; 
        prompt.start();
        prompt.get(['token'], function (err, result) {
          if (e){
              console.log("error", e);
              return;
          }
          request.post({url: url, oauth: oauth, json: true, body: {token: result.token}}, function (e, r, body) {
          if (e){
            console.log("error", e);
            return;
          }
          console.log(body)
        })
        })
      } else {
        console.log("DONE", transResp);
      }
    })
}
})
