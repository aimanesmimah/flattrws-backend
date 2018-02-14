var express = require('express');
var middlewares = require('./middlewares');

var port = normalizePort(process.env.PORT || '4000');


const app = express()
    .use(middlewares.logger);

app.set('port', port);

app.get('/',(req,res)=> {
    res.json({success:true});
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
