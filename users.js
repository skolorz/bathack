var request = require("request"),
        qs = require('querystring'),
        storage = require('node-persist'),
        CONSUMER_KEY = 'yn3jcqguouvorwo4lofzri5bdsv05dipnsftxkxv',
        CONSUMER_SECRET = '3mhnf1dmgmzkple4n02o0dl1nsdub0xcckzr0idt',
        oauth,
        host = 'http://52.164.126.252',
        prefix = '/obp/v2.1.0',
        url = host + prefix + '/users/current';

storage.initSync();
oauth= storage.getItemSync('oauth');
console.log(oauth);
request.post({url:url, oauth:oauth}, function (e, r, body) {
        var req_data = qs.parse(body);
        if (e){
                console.log("error", e);
        }
        console.log(req_data);
})
