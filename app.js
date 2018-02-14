var express = require('express');
var middlewares = require('./middlewares');
var oauthConfig = require('./config/oauthConfig');

var port = normalizePort(process.env.PORT || '4000');


const app = express()
    .use(middlewares.logger);

app.set('port', port);

app.get('/',(req,res)=> {
    res.json({success:true});
});

app.get('/authenticate',(req,res)=> {
    console.log(oauthConfig.authUri());
    res.redirect(oauthConfig.authUri());
});

app.get('/flattr',(req,res)=> {
    const options = {
        code : req.query.code
    }

    const result = oauthConfig.getAuthToken(options);

    res.json(result);

});

app.listen(port,()=> {
    console.log(`express server running on port : ${port}`);
});

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
