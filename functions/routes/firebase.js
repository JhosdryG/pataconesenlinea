const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Development Credentials
   var serviceAccount = require("../../jgp-admin-firebase-adminsdk-koimr-de33c5fdf0.json");
   admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://jgp-admin.firebaseio.com",
     storageBucket: "gs://jgp-admin.appspot.com"
   });

// Production Credentials
//admin.initializeApp(functions.config().firebase);
// Router and db Instances
const db = admin.database();

module.exports = db;