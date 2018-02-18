var express = require('express');
var bodyParser = require('body-parser');
var middlewares = require('./middlewares');
var oauthConfig = require('./config/oauthConfig');
var firebaseConfig = require('./config/firebaseConfig');


var port = normalizePort(process.env.PORT || '7000');


const app = express().use(middlewares.logger);

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//firebaseConfig.updateOrCreateItems('ddddddddddd',payload);
//firebaseConfig.getMarkedItems('ddddddddddd').then(data => console.log(data));
/*firebaseConfig.removeOneItem('ddddddddddd','sara')
    .then(newItems =>{
        console.log(newItems)
    }, err => {
        console.log(err);
    });
*/


app.set('port', port);

app.get('/',(req,res)=> {
    res.json({success:true});
});

app.get('/authenticate',(req,res)=> {
    console.log(oauthConfig.authUri());

    res.json({redirectUrl : oauthConfig.authUri()});

});

app.get('/flattr',(req,res)=> {
    const options = {
        code : req.query.code
    }

    oauthConfig.getAuthToken(options).then(
        result => {
            res.json(result);
        },
        error => {
            res.json({success:false , message : "unexpected error has occured"});
        }
    );


});

app.get('/getToken/:code',(req,res)=> {
    const code = req.params.code;

    if(code) {
        const options = {code}

        oauthConfig.getAuthToken(options).then(
            result => {
                res.json(result);
            },
            error => {
                res.json({success:false , message : "unexpected error has occured"});
            }
        )
    }
    else{
        res.json({success : false , message : "your authentication code is invalid"});
    }
});

app.post('/firebase/add',(req,res)=> {
    console.log(req.body);
    res.json({success : true});
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
