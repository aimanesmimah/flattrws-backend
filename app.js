var express = require('express');
var bodyParser = require('body-parser');
var Watcher = require('rss-watcher');
var passport = require('passport');
var middlewares = require('./middlewares');
var flattrConfig = require('./config/flattrConfig');
var oauthConfig = require('./config/oauthConfig');
var firebaseConfig = require('./config/firebaseConfig');
var passportStrategy = require('./config/passportConfig');
passport.use(passportStrategy);

var port = normalizePort(process.env.PORT || '7000');


const app = express().use(middlewares.logger);

//using this express middleware to allow http requests with cors

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.set('port', port);

// test endpoint
app.get('/',(req,res)=> {
    res.json({success:true});
});

// passport authentication test

app.get('/pass',passport.authenticate('token', { session: false }),(req,res) => {
     if(req.user)
         res.json({success : true, user : req.user});
     else
         res.json({success : false});
});

//oauth endpoints

app.get('/authenticate',(req,res)=> {
    console.log(oauthConfig.authUri());

    res.json({redirectUrl : oauthConfig.authUri()});

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

// flattr items endpoint

app.post('/flattr',(req,res)=> {
     const token = req.body.token;
     const url = req.body.url;
     const title = req.body.title;

     flattrConfig.submitForflattrthing(token,url,title).then(data=> {
         console.log(data);
         res.json({success : true, data : data});
     },err=> {
         res.json({success : false, message : "something unexpected happened",err_message : err});
     });

});

// firebase endpoints to persist user login session actions

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

app.post('/firebase/removeAndAdd',(req,res)=>{
    var userId = req.body.userId;
    var item = req.body.markedItem;

    firebaseConfig.removeOneItem(userId,item.collectionId).then(newItems => {
        firebaseConfig.addOneItem(userId,item).then(newItems => {
            res.json({success : true, message : "items updated successfully", items : newItems });
        }).catch(err=> {
            res.json({success : false,message : err});
        });

    }).catch(err=>{
        res.json({success : false,message : "an expected error happened. try again"})
    });


});

// rss feed endpoints

app.post('/feedrss/lastEpisode',(req,res)=> {
    var feedUrl = req.body.url;

    var watcher = new Watcher(feedUrl);

    watcher.run((err,articles) => {
        if(err)
            res.json({success : false, message : "some error has occured. Please try again"});
        else{
            var lastArticle = articles[articles.length-1];
            var article = {
                title : lastArticle.title,
                description : lastArticle.description,
                pubdate : lastArticle.pubdate,
                enclosures : lastArticle.enclosures
            }

            res.json({success : true , article : article});
        }
    })

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
