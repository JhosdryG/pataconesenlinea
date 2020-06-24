const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Development Credentials
 var serviceAccount = require("../../pataconesenlinea-f3a50-firebase-adminsdk-coa3o-f391094d0f.json");
 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://pataconesenlinea-f3a50.firebaseio.com",
   storageBucket: "gs://pataconesenlinea-f3a50.appspot.com"
 });

// Production Credentials
// admin.initializeApp(functions.config().firebase);
// Router and db Instances
const db = admin.database();

module.exports = db;
