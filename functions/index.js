const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const hbs = require('handlebars');
const path = require('path');
const helmet = require('helmet');
const app = express();
const nocache = require('nocache');
const onHeaders = require('on-headers');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.engine('hbs',engines.handlebars);
app.set('view engine', '.hbs');

// no-cache settings
app.use(nocache());
// app.use((req, res, next) => {
//     onHeaders(res, () => {
//         this.removeHeader('ETag');
//     });
// });
app.set('etag', false);
app.use(helmet());


// Routes
app.use(require('./routes/login'));
app.use(require('./routes/admin'));


// Static files
app.use(express.static(path.join(__dirname, 'public')));

exports.app = functions.https.onRequest(app);