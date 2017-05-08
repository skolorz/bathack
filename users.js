var request = require("request"),
        qs = require('querystring'),
        storage = require('node-persist'),
        oauth,
        login,
        host = 'http://52.164.126.252',
        prefix = '/obp/v2.1.0',
        url = host + prefix + '/users/current';

storage.initSync();
login = storage.getItemSync('login');
oauth = storage.getItemSync(login);
console.log(oauth);

request.get({url: url, oauth: oauth}, function (e, r, body) {
        var req_data = qs.parse(body);
        if (e){
                console.log("error", e);
        }
        console.log(req_data);
})
