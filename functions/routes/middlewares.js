const bcrypt = require('bcrypt');

// Middleware used to validate log in protected routes
const verifyLog = (req, res, next) => {
    const pass = 'sd68ad1s';
    const urlHash = decodeURIComponent(req.query[pass]);

    bcrypt.compare(pass, urlHash, (err, correct) => {
      if(err) return err;
      if(correct) return next();
      else return res.redirect('/login');
    });
}
module.exports = {
    verifyLog
}