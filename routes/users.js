var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/users');
const passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();

router.use(bodyParser.json());

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    } else {
      user.save()
        .then((user) => {
          passport.authenticate('local')(req, res, () => {
            var token = authenticate.getToken({ _id: req.user._id });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, token: token, status: 'Registration Successful!' });
          });
        }, err => next(err))
        .catch(err => next(err));
    }
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: 'Login Unsuccessful!!!', err: info });
     
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: 'Login Unsuccessful!!', err: 'Could not log in user!' });
      }
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, token: token, status: 'Login Successful!' });
    });
  })(req, res, next);
});

module.exports = router;
