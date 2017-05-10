var request = require("request"),
        qs = require('querystring'),
        storage = require('node-persist'),
        oauth,
        host = 'http://52.164.126.252',
        prefix = '/obp/v2.1.0',
        url = host + prefix + '/banks';

storage.initSync();
oauth= storage.getItemSync('oauth');
console.log(oauth);
console.log(url);
request.get({url: url}, function (e, r, body) {
        var req_data = qs.parse(body);
        if (e){
                console.log("error", e);
        }
        console.log(req_data);
})
