var TokenAuthStrategy = require('passport-token-auth');
var firebaseConfig = require('./firebaseConfig');



export default new TokenAuthStrategy((token, done)=> {
    firebaseConfig.getUserByToken(token).then(userId => {
        if(!userId)
            return done(null,false);

        const user = userId;
        return done(null,user,{scope : 'all'});
    }).catch(err => {
        return done(err);
    });
})