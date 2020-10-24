const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const hbs = require('handlebars');
const path = require('path');
const helmet = require('helmet');
const app = express();

app.use(express.urlencoded({extended:false}));

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.engine('hbs',engines.handlebars);
app.set('view engine', '.hbs');
app.use(helmet());

// Routes
app.use(require('./routes/login'));
app.use(require('./routes/admin'));
app.use(require('./routes/web'));
app.use(require('./routes/mail'));


// Static files
app.use(express.static(path.join(__dirname, 'public')));

exports.app = functions.https.onRequest(app);