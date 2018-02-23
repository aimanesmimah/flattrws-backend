var firebase = require('firebase');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCuxwngom-jIXv0kUEKdiMUZgR8xEEFPhs",
    authDomain: "itunespodcasts-c7e47.firebaseapp.com",
    databaseURL: "https://itunespodcasts-c7e47.firebaseio.com",
    projectId: "itunespodcasts-c7e47",
    storageBucket: "itunespodcasts-c7e47.appspot.com",
    messagingSenderId: "481731853243"
};
firebase.initializeApp(config);

var markedItemsRef = firebase.database().ref('markedItems');
var usersTokensRef = firebase.database().ref('usersTokens');

// methods on user session actions

var getMarkedItems = function getMarkedItems(userId){
    var userRef = markedItemsRef.child(userId);


    return new Promise((resolve,reject) => {
        userRef.on('value',(snap) => {
            if(!snap.val())
                return reject('no user');
            return resolve(snap.val().items);
        });

    });
}


module.exports.getMarkedItems = getMarkedItems;

var updateOrCreateItems = function updateOrCreateItems(userId,items) {
     var userRef = markedItemsRef.child(userId);


     userRef.update({items});
};

module.exports.updateOrCreateItems = updateOrCreateItems ;


module.exports.addOneItem = (userId,payload) => {

    return new Promise((resolve,reject) => {
        var newItems ;
        getMarkedItems(userId).then(items => {
            for(let i = 0; i < items.length ; i++){
                if(items[i].collectionId === payload.collectionId){
                    return reject("podcast already marked");
                }
            }

            newItems = [...items,payload];
            updateOrCreateItems(userId,newItems);
            return resolve(newItems);
        }).catch(err => {
            newItems = [payload];
            updateOrCreateItems(userId,newItems);
            return resolve(newItems);
        });

    });
}

module.exports.removeOneItem = (userId,collectionId) => {

       return new Promise((resolve,reject) => {

           getMarkedItems(userId).then(items => {
               var newItems = items.filter(item => item.collectionId != collectionId);
               updateOrCreateItems(userId,newItems);
               return resolve(newItems);
           }).catch(err => reject(err));

    });

}

module.exports.removeAllItems =  userId => {
    var userRef = markedItemsRef.child(userId);

    userRef.remove();
}

// methods on authentication tokens

const getAllTokens = () => {

    return new Promise((resolve,reject) => {
        usersTokensRef.on('value',(snap)=> {
            if(!snap.val())
                return reject('no items');

            return resolve(snap.val());
        });
    });
}

module.exports.getUserToken = (userId) => {
    var userRef = usersTokensRef.child(userId);


    return new Promise((resolve,reject) => {
        userRef.on('value',(snap) => {
            if(!snap.val())
                return reject('no user');
            return resolve(snap.val().token);
        });

    });
}



module.exports.getUserByToken = (token) => {

    return new Promise((resolve,reject) => {
        getAllTokens().then(itemsObj => {
            console.log(itemsObj);

            for(let prop in itemsObj) {
                if (itemsObj[prop].token === token) {
                    return resolve(prop);
                    break;
                }
            }

            return reject('no user found');
        }).catch(err => reject(err));

    });
}




module.exports.addUserToken = (userId,token) => {
    var userRef = usersTokensRef.child(userId);

    return new Promise((resolve,reject) => {
        userRef.update({token});
        return resolve("user token updated");
    });
}

module.exports.removeUserToken = (userId) => {
    var userRef = usersTokensRef.child(userId);

    return new Promise((resolve,reject) => {
        userRef.remove();
        return resolve('user token removed');

    });
}

