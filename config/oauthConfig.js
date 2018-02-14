var simple_oauth2 = require('simple-oauth2');
var flattr = require('./flattrConfig');

// Set the configuration settings
const credentials = {
    client: {
        id: flattr.config.client_id,
        secret: flattr.config.client_secret
    },
    auth: {
        tokenHost: flattr.config.host,
        authorizePath: flattr.config.path
    }
};

module.exports.authUri = () => {
    // Initialize the OAuth2 Library
    const oauth2 = simple_oauth2.create(credentials);

    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: flattr.config.redirect_uri,
        scope: flattr.config.scope
    });

    return authorizationUri;
}


module.exports.getAuthToken = options => {
    oauth2.authorizationCode.getToken(options, function(error, result){
        if (error) {
            console.error('Access Token Error');
            return {success : false ,message : 'Authentication failed',error : error};
        }

        console.log('The resulting token: ', result);
        const tokenObject = oauth2.accessToken.create(result);


        const data = flattr.getAuthenticatedUser(tokenObject.token.access_token);

        if(data.error){
            return {success: false , message: data.error_description}
        }
        else{
            return {success : true, data : data};
        }

    });
}


