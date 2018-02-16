var simple_oauth2 = require('simple-oauth2');
var flattrConfig = require('./flattrConfig');

// Set the configuration settings
const credentials = {
    client: {
        id: flattrConfig.config.client_id,
        secret: flattrConfig.config.client_secret
    },
    auth: {
        tokenHost: flattrConfig.config.host,
        authorizePath: flattrConfig.config.path
    }
};

const oauth2 = simple_oauth2.create(credentials);

module.exports.authUri = () => {
    // Initialize the OAuth2 Library

    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: flattrConfig.config.redirect_uri,
        scope: flattrConfig.config.scope
    });

    return authorizationUri;
}


module.exports.getAuthToken = options => {
    return new Promise((resolve,reject) => {
        oauth2.authorizationCode.getToken(options, function(error, result){
            if (error) {
                console.error('Access Token Error');
                resolve({success : false ,message : 'Authentication failed',error : error});
            }

            console.log('The resulting token: ', result);
            const tokenObject = oauth2.accessToken.create(result);


            flattrConfig.getAuthenticatedUser(tokenObject.token.access_token).then(
                data => {
                    console.log(data);
                    if(data.error){
                        resolve({success: false , message: data.error_description});
                    }
                    else{
                        console.log('dkhaal');
                        resolve({success : true, data : data,token : tokenObject.token});
                    }
                },
                error => {
                    resolve({success : false, message : "somehting unexpected happened"});
                }
            );


        });
    });

}


