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


//firebaseConfig.updateOrCreateItems('aaaaaaaaaaaaa',[]);
//firebaseConfig.getMarkedItems('jgglx5').then(data => console.log(data));
/*firebaseConfig.removeOneItem('jgglx5','79687345')
    .then(newItems =>{
        console.log(newItems)
    }, err => {
        console.log(err);
    });
*/

/*var payload = {
    name : "haay",
    pass : "reus"
}

firebaseConfig.addOneItem('ffffffffff',payload).then(items => {
    console.log(items)
}).catch(err => console.log("app.js " + err));*/

//firebaseConfig.removeAllItems('ffhjgjhgfff');

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
    var userId = req.body.userId;
    var item = req.body.markedItem;

    firebaseConfig.addOneItem(userId,item).then(newItems => {
        res.json({success : true, message : "item added successfully", items : newItems });
    }).catch(err=> {
        res.json({success : false,message : err})
    });

});

app.post('/firebase/delete',(req,res)=> {
   var userId = req.body.userId;
   var collectionId = req.body.itemId;

   firebaseConfig.removeOneItem(userId,collectionId).then(newItems => {
       res.json({success : true, message : "item removed successfully", items : newItems })
   }).catch(err=>{
       res.json({success : false,message : "an expected error happened. try again"})
   });
});

app.get('/firebase/items/:id',(req,res)=> {
    var userId = req.params.id;

   firebaseConfig.getMarkedItems(userId).then(items => {
       res.json({success : true, message : "item retrieved successfully", items : items })
   }, err => {
       res.json({success : false,message : "an expected error happened. try again"})
   });
});

app.get('/firebase/deleteAll/:id',(req,res) => {
    var userId = req.params.id;

   firebaseConfig.removeAllItems(userId);

   res.json({success : true , message : "items removed successfully"});
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
