var flattr = require('flattr');

module.exports.config = {
    client_id: 'qALnzUlXSMC4C4UFvp0kBdtPI3yhm2yW',
    client_secret: 'tMcM6dgXAdThDVIwJxd8rwwTmlecqHzX7nnr7nZ69y2k3pdrhPcGhmTucEAK0j8C',
    redirect_uri: 'http://localhost:8080/#/validate',
    scope : 'flattr',
    host : 'https://flattr.com/oauth/authorize',
    path : '/oauth/authorize'
}


module.exports.getAuthenticatedUser = token => {


        return new Promise((resolve,reject) => {

            flattr.users.get_auth(token, function (data) {
                  resolve(data);
            });
        });
}