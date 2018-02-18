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


var updateOrCreateItems = function updateOrCreateItems(userId,items) {
     var userRef = markedItemsRef.child(userId);

     userRef.update({items});
};

module.exports.updateOrCreateItems = updateOrCreateItems ;


module.exports.getMarkedItems = (userId) => {
    var userRef = markedItemsRef.child(userId);


    return new Promise((resolve,reject) => {
        userRef.on('value',(snap) => {

            return resolve(snap.val());
        });

    });
}

module.exports.removeOneItem = (userId,collectionId) => {
    var userRef = markedItemsRef.child(userId);



       return new Promise((resolve,reject) => {
           userRef.on('value',(snap) => {
           var newItems = snap.val().items.filter((item) => item.name !== collectionId);
           if(!newItems.length)
               return reject("list is empty");

           updateOrCreateItems(userId,newItems);
           return resolve(newItems);
           });

    });

}

